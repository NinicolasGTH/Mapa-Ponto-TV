import React from 'react'
import styled from 'styled-components'
 
const Card = styled.div`
  background: #141920;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1.5rem;
  transition: border-color 0.2s, transform 0.2s;
 
  &:hover {
    border-color: rgba(0,114,192,0.4);
    transform: translateY(-2px);
  }
`
 
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`
 
const Nome = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
`
 
const Distancia = styled.span`
  background: rgba(249,174,66,0.1);
  border: 1px solid rgba(249,174,66,0.2);
  color: #f9ae42;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: 0.5rem;
`
 
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
 
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.825rem;
  color: #64748b;
`
 
const InfoIcon = styled.span`
  font-size: 0.9rem;
  flex-shrink: 0;
`
 
const Estado = styled.span`
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0072c0;
  margin-bottom: 0.5rem;
`
 
const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 1rem 0;
`
 
const BtnWhats = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(0,114,192,0.1);
  border: 1px solid rgba(0,114,192,0.2);
  color: #0072c0;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.6rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  margin-top: 1rem;
 
  &:hover {
    background: rgba(0,114,192,0.2);
    border-color: #0072c0;
  }
`
 
function UnidadeCard({ unidade }) {
  const whatsLink = unidade.telefone
    ? `https://wa.me/55${unidade.telefone.replace(/\D/g, '')}`
    : null
 
  return (
    <Card>
      <Estado>{unidade.estado}</Estado>
      <CardHeader>
        <Nome>{unidade.nome}</Nome>
        {unidade.distancia !== undefined && (
          <Distancia>~{unidade.distancia}km</Distancia>
        )}
      </CardHeader>
 
      <Info>
        {unidade.local && (
          <InfoItem>
            <InfoIcon>📍</InfoIcon>
            {unidade.local}
          </InfoItem>
        )}
        {(unidade.franqueado || unidade.franqueada) && (
          <InfoItem>
            <InfoIcon>👤</InfoIcon>
            {unidade.franqueado || unidade.franqueada}
          </InfoItem>
        )}
        {unidade.telefone && (
          <InfoItem>
            <InfoIcon>📞</InfoIcon>
            {unidade.telefone}
          </InfoItem>
        )}
        {unidade.instagram && (
          <InfoItem>
            <InfoIcon>📸</InfoIcon>
            {unidade.instagram}
          </InfoItem>
        )}
      </Info>
 
      {whatsLink && (
        <>
          <Divider />
          <BtnWhats href={whatsLink} target="_blank" rel="noopener noreferrer">
            💬 Falar pelo WhatsApp
          </BtnWhats>
        </>
      )}
    </Card>
  )
}
 
export default UnidadeCard