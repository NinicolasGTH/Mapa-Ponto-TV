import React, { useState } from 'react'
import styled from 'styled-components'
import BrazilMap from './Map'
import "react-svg-map/lib/index.css"
import { franchisees } from './franchisees'
import MapaInterativo from './MapaInterativo'
import UnidadeCard from './UnidadeCard'

// ─────────────────────────────────────────
// ESTILOS BLOCO DE CÓDIGO QUE ESTILIZA O MAPA E OS COMPONENTES AO REDOR
// ─────────────────────────────────────────

const Container = styled.div`
  background: #080c12;
  overflow-x: hidden;
`

const HeroMap = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  position: relative;
  background: #080c12;

  @media (max-width: 768px) {
    padding: 5rem 1rem 3rem;
  }
`

const Glow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,114,192,0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`

const Tag = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #0072c0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 20px;
    height: 1px;
    background: #0072c0;
  }
`

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-align: center;
  margin-bottom: 0.75rem;
  line-height: 1.1;
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 3rem;
`

const MapRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`

const MapWrap = styled.div`
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const SidePanel = styled.div`
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const StateLabel = styled.div`
  background: rgba(0,114,192,0.1);
  border: 1px solid rgba(0,114,192,0.2);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`

const StateName = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0072c0;
  margin-bottom: 0.25rem;
`

const StateTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
`

const CardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #334155;
  text-align: center;
  gap: 1rem;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.4;
`

const EmptyText = styled.p`
  font-size: 0.95rem;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 0;
`

// ─────────────────────────────────────────
// COMPONENTE BLOCO DE CÓDIGO QUE FAZ A MÁGICA DE EXIBIR AS UNIDADES POR ESTADO AO CLICAR NO MAPA
// ─────────────────────────────────────────

function Franqueados() {
  const [selectedState, setSelectedState] = useState('')

  function handleLocationClick(e) {
    const id = e.target.id
    const estadosAtivos = ['pr', 'sp', 'sc']
    if (estadosAtivos.includes(id)) {
      setSelectedState(id)
    }
  }

  const selectedFranchise = franchisees.find(f => f.id === selectedState)

  return (
    <Container>

      <HeroMap>
        <Glow />
        <Tag>Nossas Unidades</Tag>
        <Title>Encontre a unidade<br />mais próxima de você</Title>
        <Subtitle>Atuamos no Paraná, São Paulo e Santa Catarina</Subtitle>

        <MapRow>
          <MapWrap>
            <BrazilMap onLocationClick={handleLocationClick} />
          </MapWrap>

          <SidePanel>
            {selectedFranchise ? (
              <>
                <StateLabel>
                  <StateName>Estado selecionado</StateName>
                  <StateTitle>{selectedFranchise.estado}</StateTitle>
                </StateLabel>
                <CardsGrid>
                  {selectedFranchise.representantes.length > 0 ? (
                    selectedFranchise.representantes.map((rep, i) => (
                      <UnidadeCard key={i} unidade={rep} />
                    ))
                  ) : (
                    <EmptyState>
                      <EmptyIcon>📍</EmptyIcon>
                      <EmptyText>Nenhuma unidade neste estado ainda.</EmptyText>
                    </EmptyState>
                  )}
                </CardsGrid>
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>🗺️</EmptyIcon>
                <EmptyText>Clique em um estado destacado<br />para ver as unidades</EmptyText>
              </EmptyState>
            )}
          </SidePanel>
        </MapRow>
      </HeroMap>

      <Divider />

      <MapaInterativo unidades={franchisees} />

      
      
    </Container>
  )
}

export default Franqueados