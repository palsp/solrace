import _ from 'lodash'
import { PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'
import { SolRaceCore } from '~/api/solana/types/sol_race_core'

interface KartInfo {
  owner: PublicKey
  kartMint: PublicKey
  kartTokenAccount: PublicKey
  kartMetadataAccount: PublicKey
  kartMasterEdition: PublicKey
  masSpeed: number
  acceleration: number
  driftPowerGenerationRate: number
  driftPowerConsumptionRate: number
  handling: number
}

type FetchKartInfo = {
  program: Program<SolRaceCore>
  poolName: string
  user: PublicKey
  kartMint: PublicKey
}

export const fetchKartInfo = async ({
  program,
  poolName,
  user,
  kartMint,
}: FetchKartInfo): Promise<[PublicKey, number, KartInfo | undefined]> => {
  const [kartAccount, kartAccountBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from('kart_account'),
      Buffer.from(poolName),
      user.toBuffer(),
      kartMint.toBuffer(),
    ],
    program.programId,
  )

  try {
    const accountInfo = await program.account.kartAccount.fetch(kartAccount)

    const {
      maxSpeed,
      acceleration,
      driftPowerConsumptionRate,
      driftPowerGenerationRate,
      handling,
      ...cleanKartInfo
    } = accountInfo

    return [
      kartAccount,
      kartAccountBump,
      {
        ...cleanKartInfo,
        masSpeed: maxSpeed.toNumber(),
        acceleration: acceleration.toNumber(),
        driftPowerConsumptionRate: driftPowerConsumptionRate.toNumber(),
        driftPowerGenerationRate: driftPowerGenerationRate.toNumber(),
        handling: handling.toNumber(),
      },
    ]
  } catch (e) {
    return [kartAccount, kartAccountBump, undefined]
  }
}
