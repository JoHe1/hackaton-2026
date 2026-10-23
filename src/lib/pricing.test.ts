import { describe, expect, test } from 'vitest';
import { computeTicket, driverSpinsFor } from './pricing';
import { DEMO_TICKET } from '../data/ticket';
import { DRIVER_SPINS } from '../data/rewards';
import { STATIONS } from '../data/stations';
import { WHEEL_ODDS, BUDGET_LEVELS } from '../data/admin';
import { WHEEL, COPILOT_REWARDS, DRIVER_SPIN_RESULT } from '../data/rewards';
import { SMALL_REFUEL_LITERS } from '../data/security';

describe('demo ticket', () => {
  const ticket = computeTicket(DEMO_TICKET.liters, DEMO_TICKET.pricePerLiter, DEMO_TICKET.copilots);

  test('reproduces the hardcoded scene figures 50,40 − 1,80 = 48,60', () => {
    expect(ticket.gross).toBe(DEMO_TICKET.gross);
    expect(ticket.discount).toBe(DEMO_TICKET.discount);
    expect(ticket.discountPerLiter).toBe(DEMO_TICKET.discountPerLiter);
    expect(ticket.total).toBe(DEMO_TICKET.total);
    expect(ticket.pointsIfAccumulate).toBe(DEMO_TICKET.pointsIfAccumulate);
  });

  test('uses the La Laguna diesel price', () => {
    const station = STATIONS.find((s) => s.id === DEMO_TICKET.station);
    expect(station?.diesel).toBe(DEMO_TICKET.pricePerLiter);
  });

  test('gives the driver 4 spins for 48,60 €', () => {
    expect(DRIVER_SPINS.total).toBe(ticket.total);
    expect(driverSpinsFor(ticket.total)).toBe(DRIVER_SPINS.spins);
  });

  test('does not apply the pass under the minimum liters', () => {
    const small = computeTicket(SMALL_REFUEL_LITERS, DEMO_TICKET.pricePerLiter, 3);
    expect(small.passApplies).toBe(false);
    expect(small.discount).toBe(0);
  });
});

describe('wheel data', () => {
  test('every odds table sums to 100 % and covers every wheel prize', () => {
    for (const level of BUDGET_LEVELS) {
      const odds = WHEEL_ODDS[level];
      expect(Object.values(odds).reduce((a, b) => a + b, 0)).toBe(100);
      expect(Object.keys(odds).sort()).toEqual([...WHEEL].sort());
    }
  });

  test('every scripted wheel result exists on the wheel', () => {
    expect(WHEEL).toContain(DRIVER_SPIN_RESULT);
    for (const reward of Object.values(COPILOT_REWARDS)) {
      if (reward?.type === 'ruleta') expect(WHEEL).toContain(reward.result);
    }
  });
});

describe('station challenges data', () => {
  test('explorer milestones are 10, 20, 50 and 100 in ascending order', async () => {
    const { STATION_EXPLORER } = await import('../data/explorer');
    expect(STATION_EXPLORER.milestones.map((m) => m.at)).toEqual([10, 20, 50, 100]);
  });

  test('the mystery station is a real station', async () => {
    const { MYSTERY_STATION } = await import('../data/explorer');
    expect(STATIONS.some((s) => s.id === MYSTERY_STATION.stationId)).toBe(true);
  });
});
