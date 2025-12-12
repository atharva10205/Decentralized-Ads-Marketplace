export function usdToLamports(usdPerView: number, usdPerSol: number) {
  const solPerView = usdPerView / usdPerSol;
  return Math.round(solPerView * 1_000_000_000); // lamports
}
