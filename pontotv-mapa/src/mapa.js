import React from 'react'
import { franchisees } from './franchisees'
import MapaInterativo from './MapaInterativo'

function Franqueados() {
  return <MapaInterativo unidades={franchisees} />
}

export default Franqueados