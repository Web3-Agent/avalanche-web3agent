'use  client'
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment'
import { useAccount, useNetwork } from 'wagmi';
import { CHAIN_ID_TO_NETWORK_MAPPING } from '../../constants/ChainIdToNetworkMapping';
import axiosHelper from '../api-helpers/axios/axiosHelper';
interface TokenData {
  symbol: string;
  name: string;
  image: string;
  address: string;
  abi: any[];
  logo_url: string;
  balance: any;
}

const TokenBalancesComponent: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState<any>([]);
  const { address, } = useAccount();
  const { chain } = useNetwork()
  const getBalanceForConnectChain = async () => {
    try {
      const { data } = await axiosHelper(`api/user-profile/balance?address=${address}&network=${CHAIN_ID_TO_NETWORK_MAPPING[chain?.id as number]}`)
      setAccountBalance(data?.data || {})
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getBalanceForConnectChain()
  }, [])

  if (!chain || !address) return null;
  return (
    <div>
      <ul>
        <li className={"flex   !text-gray-800  text-lg font-semibold items-center gap-x-4 mt-20 mb-6 ml-2"}>
          <h2>Balances</h2>
        </li>
        {!accountBalance?.items?.length && (
          <div className='flex items-center justify-start text-base font-semibold px-2'>No Data Found</div>
        )}
        {accountBalance?.items?.map((token: TokenData, index: number) => (
          <li
            className={"flex  rounded-xl p-2 cursor-pointer bg-white border-2 active:bg-gray-200 !text-gray-700  text-sm font-semibold items-center gap-x-4 mt-2"}
            key={index}
          >
            {/* <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                overflow: 'hidden',
                // border: '2px solid black',
                marginLeft: "5px"
              }}
            >
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                src={token?.logo_urls?.token_logo_url}
                alt={token?.logo_url?.chain_logo_url}
              />
            </div> */}
            {token?.contract_ticker_symbol} : {parseFloat((token.balance || '0')).toFixed(2)}
          </li>
        ))}
        <li className={"flex   !text-gray-800  text-lg font-semibold items-center gap-x-4 mt-2 mb-6 ml-2"}>
          {accountBalance?.updated_at?.length && (
            <span className='text-xs text-gray-400 italic'>Last Updated @ {moment(accountBalance.updated_at).format('LLL') || 'NA'}</span>
          )}
        </li>
      </ul>
    </div>
  );



};

export default TokenBalancesComponent;
