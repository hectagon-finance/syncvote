import { useEffect, useContext } from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GlobalLoading from '@components/GlobalLoading/GlobalLoading';
import { registerVoteMachine } from 'directed-graph';
import { SingleChoice } from 'single-vote';
import { Polling } from 'polling';
import { Veto } from 'veto';
import { UpVote } from 'upvote';
import { DocInput } from 'doc-input';
import { AuthContext } from '@layout/context/AuthContext';

function App({ layout }: { layout: any }) {
  // const [isAuth, setIsAuth] = useState(false);
  // const token = window.localStorage.getItem('isConnectWallet');
  const { loading } = useSelector((state: any) => state.ui);
  const { session } = useContext(AuthContext);
  const env = import.meta.env.VITE_ENV;

  useEffect(() => {
    if (env === 'production') {
      registerVoteMachine(SingleChoice);
      registerVoteMachine(Polling);
      registerVoteMachine(Veto);
      registerVoteMachine(UpVote);
    } else {
      registerVoteMachine(SingleChoice);
      registerVoteMachine(Polling);
      registerVoteMachine(Veto);
      registerVoteMachine(UpVote);
      registerVoteMachine(DocInput);
    }
  }, [session, env]);

  const Layout: any = layout;
  return (
    <Layout>
      <GlobalLoading loading={loading} />
      <Outlet />
    </Layout>
  );
}

export default App;
