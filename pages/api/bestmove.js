import stockfish from 'stockfish';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { moves } = req.body;

  if (!moves || typeof moves !== 'string') {
    return res.status(400).json({ error: 'Paramètre "moves" manquant ou invalide' });
  }

  const engine = stockfish();
  let bestMove = null;

  engine.onmessage = function (event) {
    const line = typeof event === 'string' ? event : event.data;
    if (line.startsWith('bestmove')) {
      bestMove = line.split(' ')[1];
      res.status(200).json({ bestMove });
    }
  };

  engine.postMessage('uci');
  setTimeout(() => {
    engine.postMessage('ucinewgame');
    engine.postMessage('position startpos moves ' + moves);
    engine.postMessage('go depth 15');
  }, 300);
}
