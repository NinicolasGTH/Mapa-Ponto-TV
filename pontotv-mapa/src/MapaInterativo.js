import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const OPENCAGE_KEY = '7dd939da3e7c4dcca4a257158845e9b9'
const RAIO_KM = 50

const iconeUnidade = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

const iconeUsuario = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

const iconeProximo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

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

function MoverMapa({ centro, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (centro) map.flyTo(centro, zoom, { duration: 1.5 })
  }, [centro, zoom, map])
  return null
}

const Section = styled.section`
  background: #080c12;
  padding: 5rem 2rem;
`
const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`
const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`
const Tag = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #f9ae42;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  &::before, &::after { content: ''; width: 20px; height: 1px; background: #f9ae42; opacity: 0.5; }
`
const Title = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`
const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`
const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`
const Input = styled.input`
  flex: 1;
  padding: 0.9rem 1.25rem;
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
  padding: 0.9rem 1.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,114,192,0.3);
  &:hover { background: #005a9a; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`
const BtnLocalizacao = styled.button`
  background: transparent;
  color: #f9ae42;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.9rem 1.25rem;
  border: 1px solid rgba(249,174,66,0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { background: rgba(249,174,66,0.08); border-color: #f9ae42; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const MapWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  .leaflet-container { height: 520px; width: 100%; background: #0d1117; }
`
const ResultInfo = styled.div`
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`
const Badge = styled.span`
  background: ${p => p.color || 'rgba(0,114,192,0.1)'};
  border: 1px solid ${p => p.border || 'rgba(0,114,192,0.2)'};
  color: ${p => p.textColor || '#0072c0'};
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 100px;
`
const Erro = styled.p`
  color: #f87171;
  font-size: 0.875rem;
  margin-top: 0.75rem;
`
const PopupStyles = styled.div`
  .leaflet-popup-content-wrapper {
    background: #141920;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .leaflet-popup-tip { background: #141920; }
  .leaflet-popup-content { color: #e2e8f0; margin: 12px 16px; }
`

function MapaInterativo({ unidades }) {
  const [endereco, setEndereco] = useState('')
  const [centro, setCentro] = useState([-15.7801, -47.9292])
  const [zoom, setZoom] = useState(5)
  const [posUsuario, setPosUsuario] = useState(null)
  const [unidadesProximas, setUnidadesProximas] = useState([])
  const [todasUnidades, setTodasUnidades] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    const todas = []
    const estadosAtivos = ['pr', 'sp', 'sc']
    unidades
      .filter(f => estadosAtivos.includes(f.id))
      .forEach(franquia => {
        franquia.representantes.forEach(rep => {
          if (rep.lat && rep.lng) {
            todas.push({ ...rep, estado: franquia.estado })
          }
        })
      })
    setTodasUnidades(todas)
  }, [unidades])

  function filtrarProximas(lat, lng) {
    return todasUnidades
      .map(u => ({ ...u, distancia: Math.round(calcularDistancia(lat, lng, u.lat, u.lng)) }))
      .filter(u => u.distancia <= RAIO_KM)
      .sort((a, b) => a.distancia - b.distancia)
  }

  async function buscarPorEndereco() {
    if (!endereco.trim()) return
    setLoading(true)
    setErro('')
    try {
      const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: { q: endereco, key: OPENCAGE_KEY, language: 'pt', countrycode: 'br', limit: 1 }
      })
      if (res.data.results.length === 0) {
        setErro('Endereço não encontrado. Tente ser mais específico.')
        return
      }
      const { lat, lng } = res.data.results[0].geometry
      setPosUsuario([lat, lng])
      setCentro([lat, lng])
      setZoom(11)
      setUnidadesProximas(filtrarProximas(lat, lng))
      setBuscou(true)
    } catch {
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
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setPosUsuario([lat, lng])
        setCentro([lat, lng])
        setZoom(11)
        setUnidadesProximas(filtrarProximas(lat, lng))
        setBuscou(true)
        setLoading(false)
      },
      () => {
        setErro('Não foi possível obter sua localização.')
        setLoading(false)
      }
    )
  }

  return (
    <Section>
      <Inner>
        <Header>
          <Tag>Busca por localização</Tag>
          <Title>Unidades próximas de você</Title>
          <Subtitle>Digite seu endereço ou CEP e veja as unidades PontoTV no mapa</Subtitle>
        </Header>

        <SearchRow>
          <Input
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            placeholder="Ex: Rua das Flores, Curitiba — ou só o CEP"
            onKeyDown={e => e.key === 'Enter' && buscarPorEndereco()}
          />
          <BtnBuscar onClick={buscarPorEndereco} disabled={loading}>
            {loading ? 'Buscando...' : '🔍 Buscar'}
          </BtnBuscar>
          <BtnLocalizacao onClick={buscarPorLocalizacao} disabled={loading}>
            📍 Minha localização
          </BtnLocalizacao>
        </SearchRow>

        {erro && <Erro>{erro}</Erro>}

        {buscou && (
          <ResultInfo>
            <Badge>
              {unidadesProximas.length > 0
                ? `${unidadesProximas.length} unidade(s) em até ${RAIO_KM}km`
                : 'Nenhuma unidade próxima'}
            </Badge>
            {unidadesProximas.length > 0 && (
              <Badge color="rgba(249,174,66,0.1)" border="rgba(249,174,66,0.2)" textColor="#f9ae42">
                Mais próxima: {unidadesProximas[0].nome} — {unidadesProximas[0].distancia}km
              </Badge>
            )}
          </ResultInfo>
        )}

        <PopupStyles>
          <MapWrap>
            <MapContainer center={centro} zoom={zoom} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MoverMapa centro={centro} zoom={zoom} />

              {todasUnidades.map((u, i) => {
                const isProxima = unidadesProximas.some(p => p.nome === u.nome)
                return (
                  <Marker key={i} position={[u.lat, u.lng]} icon={isProxima ? iconeProximo : iconeUnidade}>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, color: '#f9ae42' }}>{u.nome}</p>
                        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 4 }}>📍 {u.local}</p>
                        {(u.franqueado || u.franqueada) && (
                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 4 }}>👤 {u.franqueado || u.franqueada}</p>
                        )}
                        {u.telefone && (
                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 4 }}>📞 {u.telefone}</p>
                        )}
                        {u.distancia && (
                          <p style={{ fontSize: '0.78rem', color: '#0072c0', fontWeight: 600, marginTop: 8 }}>~{u.distancia}km de você</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              })}

              {posUsuario && (
                <>
                  <Marker position={posUsuario} icon={iconeUsuario}>
                    <Popup>
                      <p style={{ fontWeight: 700, color: '#ef4444' }}>📍 Você está aqui</p>
                    </Popup>
                  </Marker>
                  <Circle
                    center={posUsuario}
                    radius={RAIO_KM * 1000}
                    pathOptions={{ color: '#0072c0', fillColor: '#0072c0', fillOpacity: 0.05, weight: 1.5, dashArray: '6' }}
                  />
                </>
              )}
            </MapContainer>
          </MapWrap>
        </PopupStyles>
      </Inner>
    </Section>
  )
}

export default MapaInterativo