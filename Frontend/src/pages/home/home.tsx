import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { dAppContext } from '@/Context/dappContext';
import { Button } from '@gear-js/vara-ui';
import { useAccount } from '@gear-js/react-hooks';
import { 
    NormalButtons,
    VoucherButtons,
    SignlessButtons,
} from '@/components/ExampleComponents';
import { useSailsCalls } from '@/app/hooks';
import "./examples.css";
import { SailsComponent } from './daoform';


function Home () {
    const sails = useSailsCalls();
    const { account } = useAccount();
    const { 
        currentVoucherId,
        setCurrentVoucherId,
        setSignlessAccount
    } = useContext(dAppContext);

    const [pageSignlessMode, setPageSignlessMode] = useState(false);
    const [voucherModeInPolkadotAccount, setVoucherModeInPolkadotAccount] = useState(false);
    const [contractState, setContractState] = useState("");

    useEffect(() => {
        if (!account) {
            setPageSignlessMode(true);
        } else {
            setPageSignlessMode(false);
        }
        if (setCurrentVoucherId) setCurrentVoucherId(null)
    }, [account]);

    return (
        <SailsComponent/>
        
    );
}

export {Home };
