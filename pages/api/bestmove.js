import Stockfish from 'stockfish.wasm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { moves } = req.body;

  if (!moves || typeof moves !== 'string') {
    return res.status(400).json({ error: 'Paramètre "moves" manquant ou invalide' });
  }

  const engine = await Stockfish();

  let bestMove = null;

  engine.addMessageListener((line) => {
    if (line.startsWith('bestmove')) {
      bestMove = line.split(' ')[1];
      res.status(200).json({ bestMove });
    }
  });

  engine.postMessage('uci');
  setTimeout(() => {
    engine.postMessage('ucinewgame');
    engine.postMessage(`position startpos moves ${moves}`);
    engine.postMessage('go depth 15');
  }, 300);
}
