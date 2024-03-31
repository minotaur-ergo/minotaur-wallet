import ExtensionTheme from '../components/app-theme/ExtensionTheme';
import MinotaurLogo from '../components/splash/MinotaurLogo';
import './extension.css';
import Connect from './Connect';
import History from './History';

const Extension = () => {
  const pageId = new URLSearchParams(window.location.search).get('id');
  const requestId = new URLSearchParams(window.location.search).get(
    'requestId',
  );

  return (
    <div className="container">
      <ExtensionTheme
        title="dApp Extension"
        navigation={<MinotaurLogo style={{ width: '40px' }} />}
      >
        {pageId ? (
          <Connect requestId={requestId} pageId={pageId} />
        ) : (
          <History />
        )}
      </ExtensionTheme>
    </div>
  );
};

export default Extension;
