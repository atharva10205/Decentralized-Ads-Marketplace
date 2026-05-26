export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { startClickWorker } = await import('./app/lib/clickWorker');
        startClickWorker();
    }
}