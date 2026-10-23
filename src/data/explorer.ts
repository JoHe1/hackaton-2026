// Retos por gasolineras. Solo cuentan repostajes con pase de copilotos válido.
export const STATION_EXPLORER = {
  distinctStations: 17,
  milestones: [
    { at: 10, badge: 'Explorador DISA' },
    { at: 20, badge: 'Ruta por la isla' },
    { at: 50, badge: 'Conoce Canarias' },
    { at: 100, badge: 'Leyenda DISA' },
  ],
};

// Reto al azar: cada semana se elige una gasolinera; repostar allí con pase = participación en el sorteo.
export const MYSTERY_STATION = {   // en la demo coincide con la del repostaje (s1) → momento "wow"
  week: 'Semana 43', stationId: 's1',
  prize: 'Viaje a La Graciosa para 4', partner: true, drawDate: 'domingo 25 de octubre',
};
