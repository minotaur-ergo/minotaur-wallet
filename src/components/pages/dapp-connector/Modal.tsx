import { UnsignedGeneratedTx } from '../../../util/interface';

interface modalProp {
  type: string;
  data: UnsignedGeneratedTx | undefined;
  onAccept: () => void;
  onDecline: () => void;
}
const handleModal = (props: modalProp) => {
  switch (props.type) {
    case 'password':
      return (
        <div>
          <div>
            Transaction info:
            <ul>
              <li>Sender:</li>
              <li>Receiver:</li>
              <li>Amount:</li>
            </ul>
          </div>
        </div>
      );
      break;

    default:
      return <div>wallet selected</div>;
      break;
  }
};

export default handleModal;
