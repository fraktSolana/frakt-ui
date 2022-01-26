import {
  Liquidity,
  LiquidityPoolKeysV4,
  Percent,
  TokenAmount,
  Token,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { RaydiumPoolInfo } from '../../contexts/liquidityPools';

export const getOutputAmount = (
  poolKeys: LiquidityPoolKeysV4,
  poolInfo: RaydiumPoolInfo,
  payToken: TokenInfo,
  payAmount: number,
  receiveToken: TokenInfo,
  slippage: Percent = new Percent(1, 100),
): {
  amountOut: string;
  minAmountOut: string;
  priceImpact: string;
} => {
  try {
    const currencyAmountIn = new TokenAmount(
      new Token(
        payToken.address,
        payToken.decimals,
        payToken.symbol,
        payToken.name,
      ),
      payAmount,
      false,
    );

    const { amountOut, minAmountOut, priceImpact } =
      Liquidity.computeCurrencyAmountOut({
        poolKeys,
        poolInfo,
        currencyAmountIn,
        currencyOut: receiveToken,
        slippage,
      });

    return {
      amountOut: amountOut.toSignificant(),
      minAmountOut: minAmountOut.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
