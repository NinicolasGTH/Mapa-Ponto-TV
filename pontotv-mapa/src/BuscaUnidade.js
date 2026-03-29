import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import UnidadeCard from './UnidadeCard'

const OPENCAGE_KEY = '7dd939da3e7c4dcca4a257158845e9b9'
const RAIO_KM = 100 // Raio de busca em quilômetros

// Função para calcular a distância com base na latitude e longitude, da fórmula de um cara ai mt brabo
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Bloco de código de estilização 
const Wrapper = styled.div`
  background: #0a0f1a;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  text-align: center;
`

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  text-align: center;
`

const FormRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 600px;
  flex-wrap: wrap;
`

const Input = styled.input`
  flex: 1;
  padding: 0.85rem 1.25rem;
  background: #141920;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  min-width: 200px;
  &::placeholder { color: #475569; }
  &:focus { border-color: #0072c0; }
`

const BtnBuscar = styled.button`
  background: #0072c0;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
  &:hover { background: #005a9a; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`

const BtnLocalizacao = styled.button`
  background: transparent;
  color: #f9ae42;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.85rem 1.25rem;
  border: 1px solid rgba(249,174,66,0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { background: rgba(249,174,66,0.08); border-color: #f9ae42; }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 1.25rem 0;
  color: #334155;
  font-size: 0.8rem;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
`

const Erro = styled.p`
  color: #f87171;
  font-size: 0.875rem;
  margin-top: 1rem;
`

const ResultadoWrap = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 3rem;
`

const ResultadoTitle = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const SemResultado = styled.div`
  text-align: center;
  padding: 3rem;
  color: #475569;
  font-size: 0.95rem;
`
// Busca unidade do PontoTV
function BuscaUnidade({ unidades }) {
  const [endereco, setEndereco] = useState('')
  const [resultado, setResultado] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [buscou, setBuscou] = useState(false)

  // Filtração de unidades onde PontoTV atua
  function filtrarUnidades(lat, lng) {
    const estadosAtivos = ['pr', 'sp', 'sc']
    const encontradas = []
    unidades
      .filter(f => estadosAtivos.includes(f.id))
      .forEach(franquia => {
        franquia.representantes.forEach(rep => {
          if (rep.lat && rep.lng) {
            const distancia = calcularDistancia(lat, lng, rep.lat, rep.lng)
            if (distancia <= RAIO_KM) {
              encontradas.push({ ...rep, distancia: Math.round(distancia), estado: franquia.estado })
            }
          }
        })
      })
    return encontradas.sort((a, b) => a.distancia - b.distancia)
  }
// BuscaPorEndereco
  async function buscarPorEndereco() {
    if (!endereco.trim()) return
    setLoading(true)
    setErro('')
    setBuscou(false)
    try {
      const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: { q: endereco, key: OPENCAGE_KEY, language: 'pt', countrycode: 'br', limit: 1 }
      })
      if (res.data.results.length === 0) {
        setErro('Endereço não encontrado. Tente ser mais específico.')
        return
      }
      const { lat, lng } = res.data.results[0].geometry
      setResultado(filtrarUnidades(lat, lng))
      setBuscou(true)
    } catch (e) {
      setErro('Erro ao buscar o endereço. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function buscarPorLocalizacao() {
    if (!navigator.geolocation) {
      setErro('Seu navegador não suporta geolocalização.')
      return
    }
    setLoading(true)
    setErro('')
    setBuscou(false)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setResultado(filtrarUnidades(latitude, longitude))
        setBuscou(true)
        setLoading(false)
      },
      () => {
        setErro('Não foi possível obter sua localização.')
        setLoading(false)
      }
    )
  }
// Bloco de return que renderiza a página
  return (
    <Wrapper>
      <Title>Encontre uma unidade perto de você</Title>
      <Subtitle>Buscamos em Paraná, São Paulo e Santa Catarina</Subtitle>

      <FormRow>
        <Input
          value={endereco}
          onChange={e => setEndereco(e.target.value)}
          placeholder="Digite sua cidade ou endereço..."
          onKeyDown={e => e.key === 'Enter' && buscarPorEndereco()}
        />
        <BtnBuscar onClick={buscarPorEndereco} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </BtnBuscar>
      </FormRow>

      <Divider>ou</Divider>

      <BtnLocalizacao onClick={buscarPorLocalizacao} disabled={loading}>
        📍 Usar minha localização
      </BtnLocalizacao>

      {erro && <Erro>{erro}</Erro>}

      {buscou && (
        <ResultadoWrap>
          <ResultadoTitle>
            {resultado.length > 0
              ? `${resultado.length} unidade(s) encontrada(s) em até ${RAIO_KM}km`
              : 'Nenhuma unidade encontrada nessa região'}
          </ResultadoTitle>
          {resultado.length > 0 ? (
            <Grid>
              {resultado.map((u, i) => <UnidadeCard key={i} unidade={u} />)}
            </Grid>
          ) : (
            <SemResultado>
              Não encontramos unidades próximas. Tente buscar em outra cidade.
            </SemResultado>
          )}
        </ResultadoWrap>
      )}
    </Wrapper>
  )
}

export default BuscaUnidade