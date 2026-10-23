// Recorre el guion de la demo en /demo y guarda capturas en ./screenshots.
// Uso: npm run build && npx vite preview --port 4173 &  →  node scripts/walkthrough.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.DEMO_URL ?? 'http://localhost:4173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const failures = [];
const check = async (locator, label) => {
  try {
    await locator.first().waitFor({ state: 'visible', timeout: 4000 });
    console.log(`  ✓ ${label}`);
  } catch {
    failures.push(label);
    console.log(`  ✗ ${label}`);
  }
};

const browser = await chromium.launch();

// --- Home replica on a phone-sized viewport (compare with referencias/referencia_disa.jpg)
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/conductor`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/00-inicio-movil.png` });
  await page.screenshot({ path: `${OUT}/00b-inicio-movil-completo.png`, fullPage: true });
  await page.locator('.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, 400));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/00c-inicio-scroll.png` });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`${BASE}/demo`);
await page.waitForTimeout(800);
const col = (i) => page.locator('main > div > div > div').nth(i);
const [lucia, dani, aitana, caja] = [0, 1, 2, 3].map(col);
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

await shot('01-demo-inicio');

console.log('Escena 1: Lucía inicia Copilotos');
await lucia.getByRole('button', { name: 'Acciones' }).click();
await page.waitForTimeout(350);
await shot('02-acciones');
await lucia.getByRole('button', { name: /Iniciar DISA Copilotos/ }).click();
await page.waitForTimeout(500);
await check(lucia.getByText(/El código cambia en/), 'QR rotativo con cuenta atrás');
await shot('03-qr');

console.log('Escena 2: Dani y Aitana escanean');
for (const phone of [dani, aitana]) {
  await phone.getByRole('button', { name: 'Acciones' }).click();
  await page.waitForTimeout(300);
  await phone.getByRole('button', { name: /Unirme como copiloto/ }).click();
  await page.waitForTimeout(300);
  await phone.getByRole('button', { name: 'Escanear', exact: true }).click();
  await page.waitForTimeout(300);
}
await check(lucia.getByText('Dani', { exact: true }), 'Dani aparece en el móvil de Lucía');
await check(lucia.getByText('Aitana', { exact: true }), 'Aitana aparece en el móvil de Lucía');
await shot('04-copilotos-unidos');

console.log('Escena 3: Pablo escanea una captura y luego en directo');
await page.getByRole('button', { name: 'Escanear captura' }).click();
await page.waitForTimeout(300);
await check(page.getByText(/Código caducado, escanea el QR en directo/), 'Error de captura');
await shot('05-pablo-captura');
await page.locator('header').getByRole('button', { name: 'Escanear', exact: true }).click();
await page.waitForTimeout(400);
await shot('06-pablo-unido');

console.log('Escena 4: pase');
await lucia.getByRole('button', { name: /OK · Crear pase/ }).click();
await page.waitForTimeout(400);
await check(lucia.getByText(/3 copilotos · 30:00 · −6 c\/L|3 copilotos · 29:5\d · −6 c\/L/), 'Pase 3 copilotos · 30:00 · −6 c/L');
await shot('07-pase');

console.log('Escena 5: caja');
await caja.getByRole('button', { name: /Pasar tarjeta de Lucía/ }).click();
await page.waitForTimeout(300);
await check(caja.getByText('Pase de copilotos detectado'), 'Caja detecta el pase');
await shot('08-caja-tarjeta');
await caja.getByRole('button', { name: 'Cobrar' }).click();
await page.waitForTimeout(400);
await check(caja.getByText('50,40 €'), 'Bruto 50,40 €');
await check(caja.getByText('−1,80 €'), 'Descuento 1,80 €');
await check(caja.getByText('48,60 €'), 'Total 48,60 €');
await shot('09-ticket-eleccion');
await lucia.getByRole('button', { name: /Descuento ahora/ }).click();
await page.waitForTimeout(600);
await check(lucia.getByText('Has ganado 4 pases de ruleta'), '4 pases de ruleta');
await shot('10-pase-consumido');

console.log('Escena 6: premios');
await dani.getByRole('button', { name: 'Girar la ruleta' }).click();
await aitana.getByRole('button', { name: 'Girar la ruleta' }).click();
await lucia.getByRole('button', { name: 'Girar la ruleta' }).click();
await page.waitForTimeout(1500);
await shot('11-ruletas-girando');
await page.waitForTimeout(3600);
await check(dani.getByText(/¡Refresco!/), 'Dani: Refresco');
await check(aitana.getByText(/¡Cine 2x1!/), 'Aitana: Cine 2x1');
await check(lucia.getByText(/¡Te ha tocado Helado!/), 'Lucía: Helado');
await check(page.locator('header').getByText(/Cupón directo: Papas/), 'Pablo: cupón Papas');
await shot('12-premios');
await dani.locator('.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, 9999));
await aitana.locator('.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, 9999));
await lucia.locator('.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, 9999));
await page.waitForTimeout(300);
await shot('12b-premios-scroll');

console.log('Escena 7: retos y ranking');
await lucia.getByRole('button', { name: 'Retos', exact: true }).click();
await page.waitForTimeout(400);
await check(lucia.getByText(/5\/5 repostajes juntos/), 'Reto 5/5 conseguido');
await check(lucia.getByText(/Racha: 5 fines de semana/), 'Racha de 5 findes');
await check(lucia.getByText('¡Estáis dentro del sorteo!'), 'Gasolinera sorpresa: dentro del sorteo');
await lucia.getByText('Explorador de gasolineras').scrollIntoViewIfNeeded();
await check(lucia.getByText('17/20 gasolineras'), 'Explorador 17/20');
await page.waitForTimeout(200);
await shot('13b-retos-gasolineras');
await lucia.locator('.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, 0));
await dani.getByRole('button', { name: 'Ofertas' }).click();
await aitana.getByRole('button', { name: 'Ranking', exact: true }).click();
await page.waitForTimeout(400);
await shot('13-retos');
await lucia.getByRole('button', { name: 'Ranking', exact: true }).click();
await page.waitForTimeout(400);
await check(lucia.getByText('Conductora del mes'), 'Lucía Conductora del mes');
await check(lucia.getByText(/Liga de Tenerife/), 'Liga de Tenerife');
await shot('14-ranking');

console.log('Escena 8: Tu verano DISA');
await lucia.getByRole('button', { name: 'Retos', exact: true }).click();
await page.waitForTimeout(300);
await lucia.getByRole('button', { name: /Tu verano DISA/ }).click();
await page.waitForTimeout(600);
await check(lucia.getByRole('button', { name: /Compartir/ }), 'Botón Compartir');
await shot('15-verano');
await lucia.getByRole('button', { name: 'Cerrar' }).click();

console.log('Escena 9: panel');
await page.getByRole('button', { name: /Panel DISA/ }).click();
await page.waitForTimeout(400);
await check(page.getByText('Datos ficticios de un piloto simulado'), 'Etiqueta datos ficticios');
await shot('16-panel');
await page.getByLabel('Presupuesto de la ruleta').fill('2');
await page.waitForTimeout(600);
await shot('17-panel-alto');
await page.getByRole('button', { name: 'Cerrar panel' }).click();

console.log('Escenas de seguridad');
const scenes = [
  ['Escanear captura', '18-seg-captura'],
  ['Copiloto lejos', '19-seg-lejos'],
  ['Copiloto repetido', '20-seg-repetido'],
  ['Repostaje pequeño', '21-seg-pequeno'],
  ['Pase caducado', '22-seg-caducado'],
  ['Sin repostaje', '23-seg-sin-repostaje'],
  ['Alerta IA', '24-seg-alerta-ia'],
];
for (const [label, file] of scenes) {
  await page.getByRole('button', { name: 'Menú del presentador' }).click();
  await page.waitForTimeout(200);
  await page.locator('.fixed').getByRole('button', { name: new RegExp(`^${label}`) }).click();
  await page.waitForTimeout(700);
  await shot(file);
  if (label === 'Alerta IA') await page.getByRole('button', { name: 'Cerrar panel' }).click();
}
await check(page.locator('body'), 'fin');

await page.getByRole('button', { name: 'Reiniciar demo' }).first().click();
await page.waitForTimeout(300);
await shot('25-reiniciada');

for (const [path, name] of [['/caja', '26-caja'], ['/panel', '27-panel'], ['/copiloto/u4', '28-pablo']]) {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto(`${BASE}${path}`);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
}

await browser.close();
console.log(failures.length ? `\nFALLOS: ${failures.join(' | ')}` : '\nGuion completo sin fallos');
process.exit(failures.length ? 1 : 0);
