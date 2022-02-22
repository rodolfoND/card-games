import { useEffect, useState } from 'react';
import { styled } from '@stitches/react';
import { cards as wholeCards } from './Card';
import './App.css';

type ICard = {
  card: String,
  value: Number,
  suit: Number,
}

type IPlayerCard = {
  card: ICard,
  player: number,
}

const Paragrafo = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
  variants: {
    enabled: {
      true: {
        border: '1px solid red',
      },
    },
  },
});

const Carta = styled('h4', {
  '&:hover': {
    cursor: 'pointer',
  },
  variants: {
    red: {
      true: {
        color: 'red',
      },
    },
    disabled: {
      true: {
        backgroundColor: 'cyan',
        '&:hover': {
          cursor: 'unset',
        },
      },
    },
  },
});

function orderCardsByValue(cards: ICard[]): ICard[] {
  return cards.sort((a: ICard, b: ICard) => {
    if (a.value > b.value || a.value === undefined || a.value === null) {
      return 1;
    }
    if (a.value < b.value || b.value === undefined || b.value === null) {
      return -1;
    }
    return 0;
  });
}

function orderPlayerCardsByValue(cards: IPlayerCard[]): IPlayerCard[] {
  return cards.sort((a: IPlayerCard, b: IPlayerCard) => {
    if (a.card.value > b.card.value || a.card.value === undefined || a.card.value === null) {
      return 1;
    }
    if (a.card.value < b.card.value || b.card.value === undefined || b.card.value === null) {
      return -1;
    }
    return 0;
  });
}

let allCards: ICard[] = [];

function getCards(count: Number): ICard[] {
  const sortedCards: ICard[] = [];

  if (count > wholeCards.length) {
    return wholeCards;
  }

  for (let i = 0; i < wholeCards.length; i++) {
    allCards.push(wholeCards[i]);
  }

  for (let i = 1; i <= count; i++) {
    sortedCards.push(allCards.splice(Math.floor(Math.random()
      * allCards.length), 1).reduce((a) => a));
  }
  return sortedCards;
}

function App() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [roundOneCards, setRoundOneCards] = useState<IPlayerCard[]>([]);
  const [roundTwoCards, setRoundTwoCards] = useState<IPlayerCard[]>([]);
  const [roundThreeCards, setRoundThreeCards] = useState<IPlayerCard[]>([]);
  const [playedCards, setPlayedCards] = useState<IPlayerCard[]>([]);
  const [playerAtual, setPlayerAtual] = useState<number>(1);
  const [winnerRoundOneCard, setWinnerRoundOneCard] = useState<IPlayerCard>();
  const [winnerRoundTwoCard, setWinnerRoundTwoCard] = useState<IPlayerCard>();
  const [winnerRoundThreeCard, setWinnerRoundThreeCard] = useState<IPlayerCard>();
  const [pairOnePoints, setPairOnePoints] = useState<number>(0);
  const [pairTwoPoints, setPairTwoPoints] = useState<number>(0);
  const [game, setGame] = useState<number>(1);
  const playerOneCards: ICard[] = orderCardsByValue([cards[0], cards[1], cards[2]]);
  const playerTwoCards: ICard[] = orderCardsByValue([cards[3], cards[4], cards[5]]);
  const playerThreeCards: ICard[] = orderCardsByValue([cards[6], cards[7], cards[8]]);
  const playerFourCards: ICard[] = orderCardsByValue([cards[9], cards[10], cards[11]]);

  useEffect(() => {
    setCards(getCards(12));
  }, []);

  useEffect(() => {
    if (roundOneCards.length === 4) {
      const winnerCard: IPlayerCard = orderPlayerCardsByValue(roundOneCards)[3];
      setWinnerRoundOneCard(winnerCard);
      setPlayerAtual(winnerCard.player);
    }
  }, [roundOneCards]);

  useEffect(() => {
    if (roundTwoCards.length === 4) {
      const winnerCard: IPlayerCard = orderPlayerCardsByValue(roundTwoCards)[3];
      setWinnerRoundTwoCard(winnerCard);
      setPlayerAtual(winnerCard.player);
    }
  }, [roundTwoCards]);

  useEffect(() => {
    if (roundThreeCards.length === 4) {
      const winnerCard: IPlayerCard = orderPlayerCardsByValue(roundThreeCards)[3];
      setWinnerRoundThreeCard(winnerCard);
      setPlayerAtual(winnerCard.player);
    }
  }, [roundThreeCards]);

  function isRedCard(card: ICard): boolean {
    return card.suit < 3;
  }

  function getPairs(player: number): number {
    if (player === 1 || player === 3) {
      return 1;
    }
    return 2;
  }

  function playCard(card: IPlayerCard): void {
    if (!(playedCards.find((e) => e === card)) && (card.player === playerAtual)) {
      setPlayedCards([...playedCards, card]);

      if (roundOneCards.length < 4) {
        if (!roundOneCards.find((e) => e === card)) {
          setRoundOneCards([...roundOneCards, card]);
        }
      } else if (roundTwoCards.length < 4) {
        if (!roundTwoCards.find((e) => e === card)) {
          setRoundTwoCards([...roundTwoCards, card]);
        }
      } else if (!roundThreeCards.find((e) => e === card)) {
        setRoundThreeCards([...roundThreeCards, card]);
      }
      if (playerAtual === 4) {
        setPlayerAtual(1);
      } else {
        setPlayerAtual(playerAtual + 1);
      }
    }
  }

  function itsPairsWonTheHand(winnerCard?: IPlayerCard, pair?: number): string {
    if (winnerCard && winnerCard.card) {
      if (getPairs(winnerCard.player) === pair) {
        return ' x';
      }
      return ' o';
    }
    return '';
  }

  function itsPairsPoints(pair: number): number {
    if (pair === 1) {
      return pairOnePoints;
    }
    return pairTwoPoints;
  }

  function isPlayed(card: ICard): boolean {
    const a = playedCards.find((e) => e.card === card) as any;
    return a;
  }

  function nextGame(): void {
    let handsWonByPairOne = 0;
    let handsWonByPairTwo = 0;
    if (winnerRoundOneCard?.player === 1 || winnerRoundOneCard?.player === 3) {
      handsWonByPairOne += 1;
    } else {
      handsWonByPairTwo += 1;
    }
    if (winnerRoundTwoCard?.player === 1 || winnerRoundTwoCard?.player === 3) {
      handsWonByPairOne += 1;
    } else {
      handsWonByPairTwo += 1;
    }
    if (winnerRoundThreeCard?.player === 1 || winnerRoundThreeCard?.player === 3) {
      handsWonByPairOne += 1;
    } else {
      handsWonByPairTwo += 1;
    }
    if (handsWonByPairOne > handsWonByPairTwo) {
      setPairOnePoints(pairOnePoints + 2);
    } else {
      setPairTwoPoints(pairTwoPoints + 2);
    }

    allCards = [];
    setCards(getCards(12));
    setRoundOneCards([]);
    setRoundTwoCards([]);
    setRoundThreeCards([]);
    setPlayedCards([]);

    if (game !== 4) {
      setGame(game + 1);
      setPlayerAtual(game + 1);
    } else {
      setGame(1);
      setPlayerAtual(1);
    }

    setWinnerRoundOneCard(undefined);
    setWinnerRoundTwoCard(undefined);
    setWinnerRoundThreeCard(undefined);
  }

  if (cards.length !== 12) {
    return (
      <h1>Loading</h1>
    );
  }

  return (
    <div className="container">
      <div className="rodada">
        Mãos
        <br />
        Dupla 1:
        {itsPairsWonTheHand(winnerRoundOneCard, 1)}
        {itsPairsWonTheHand(winnerRoundTwoCard, 1)}
        {itsPairsWonTheHand(winnerRoundThreeCard, 1)}
        <br />
        Dupla 2:
        {itsPairsWonTheHand(winnerRoundOneCard, 2)}
        {itsPairsWonTheHand(winnerRoundTwoCard, 2)}
        {itsPairsWonTheHand(winnerRoundThreeCard, 2)}
      </div>
      <div className="total">
        Tentos
        <br />
        Dupla 1:
        {itsPairsPoints(1)}
        <br />
        Dupla 2:
        {itsPairsPoints(2)}
      </div>
      <div className="mesa">
        <div className="player-1">
          <Paragrafo enabled={playerAtual === 1}>
            Player 1:
            <Carta
              red={!!isRedCard(playerOneCards[0])}
              disabled={!!isPlayed(playerOneCards[0])}
              onClick={() => playCard({ player: 1, card: playerOneCards[0] })}
            >
              {playerOneCards[0].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerOneCards[1])}
              disabled={!!isPlayed(playerOneCards[1])}
              onClick={() => playCard({ player: 1, card: playerOneCards[1] })}
            >
              {playerOneCards[1].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerOneCards[2])}
              disabled={!!isPlayed(playerOneCards[2])}
              onClick={() => playCard({ player: 1, card: playerOneCards[2] })}
            >
              {playerOneCards[2].card}
            </Carta>
          </Paragrafo>
        </div>
        <div className="player-2">
          <Paragrafo enabled={playerAtual === 2}>
            Player 2:
            <Carta
              red={!!isRedCard(playerTwoCards[0])}
              disabled={!!isPlayed(playerTwoCards[0])}
              onClick={() => playCard({ player: 2, card: playerTwoCards[0] })}
            >
              {playerTwoCards[0].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerTwoCards[1])}
              disabled={!!isPlayed(playerTwoCards[1])}
              onClick={() => playCard({ player: 2, card: playerTwoCards[1] })}
            >
              {playerTwoCards[1].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerTwoCards[2])}
              disabled={!!isPlayed(playerTwoCards[2])}
              onClick={() => playCard({ player: 2, card: playerTwoCards[2] })}
            >
              {playerTwoCards[2].card}
            </Carta>
          </Paragrafo>
        </div>
        <div className="player-3">
          <Paragrafo enabled={playerAtual === 3}>
            Player 3:
            <Carta
              red={!!isRedCard(playerThreeCards[0])}
              disabled={!!isPlayed(playerThreeCards[0])}
              onClick={() => playCard({ player: 3, card: playerThreeCards[0] })}
            >
              {playerThreeCards[0].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerThreeCards[1])}
              disabled={!!isPlayed(playerThreeCards[1])}
              onClick={() => playCard({ player: 3, card: playerThreeCards[1] })}
            >
              {playerThreeCards[1].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerThreeCards[2])}
              disabled={!!isPlayed(playerThreeCards[2])}
              onClick={() => playCard({ player: 3, card: playerThreeCards[2] })}
            >
              {playerThreeCards[2].card}
            </Carta>
          </Paragrafo>
        </div>
        <div className="player-4">
          <Paragrafo enabled={playerAtual === 4}>
            Player 4:
            <Carta
              red={!!isRedCard(playerFourCards[0])}
              disabled={!!isPlayed(playerFourCards[0])}
              onClick={() => playCard({ player: 4, card: playerFourCards[0] })}
            >
              {playerFourCards[0].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerFourCards[1])}
              disabled={!!isPlayed(playerFourCards[1])}
              onClick={() => playCard({ player: 4, card: playerFourCards[1] })}
            >
              {playerFourCards[1].card}
            </Carta>
            <Carta
              red={!!isRedCard(playerFourCards[2])}
              disabled={!!isPlayed(playerFourCards[2])}
              onClick={() => playCard({ player: 4, card: playerFourCards[2] })}
            >
              {playerFourCards[2].card}
            </Carta>
          </Paragrafo>
        </div>
        <div className="tabuleiro">
          <div className="card3">{playedCards.map((i) => (i.player === 3 ? i.card.card : null))}</div>
          <div className="card2">{playedCards.map((i) => (i.player === 2 ? i.card.card : null))}</div>
          <div className="card1">{playedCards.map((i) => (i.player === 1 ? i.card.card : null))}</div>
          <div className="card4">{playedCards.map((i) => (i.player === 4 ? i.card.card : null))}</div>
        </div>
      </div>
      <div className="result">
        <div>
          <p>
            {roundOneCards.length === 4 ? 'Winner Primeira Mão: ' : null}
            {roundOneCards.length === 4 ? winnerRoundOneCard?.card ? `${winnerRoundOneCard?.card.card} - Player: ${winnerRoundOneCard?.player}` : null : null}
          </p>
          <p>
            {roundTwoCards.length === 4 ? 'Winner Segunda Mão: ' : null}
            {roundTwoCards.length === 4 ? winnerRoundTwoCard?.card ? `${winnerRoundTwoCard?.card.card} - Player: ${winnerRoundTwoCard?.player}` : null : null}
          </p>
          <p>
            {roundThreeCards.length === 4 ? 'Winner Terceira Mão: ' : null}
            {roundThreeCards.length === 4 ? winnerRoundThreeCard?.card ? `${winnerRoundThreeCard?.card.card} - Player: ${winnerRoundThreeCard?.player}` : null : null}
          </p>
        </div>
        {playedCards.length === 12 ? (
          <input
            type="button"
            value="Próximo Jogo"
            onClick={() => nextGame()}
          />
        ) : null}
      </div>
      <div className="reset">
        <input
          type="button"
          value="Reiniciar"
          onClick={() => document.location.reload()}
        />
      </div>
      <div className="acoes">
        <input
          type="button"
          value="Truco"
        />
        <input
          type="button"
          value="Seis"
        />
        <input
          type="button"
          value="Nove"
        />
        <input
          type="button"
          value="Doze"
        />
        <input
          type="button"
          value="Aceitar"
        />
        <input
          type="button"
          value="Correr"
        />
      </div>
    </div>
  );
}

export default App;
