import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function ChangeViewButton({ handleChangeView }) {
    const handler = (e) => {
        handleChangeView(e.target.id);
    }
  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item onClick={handler} id="manager">Manager</Dropdown.Item>
      <Dropdown.Item onClick={handler} id="cashier">Cashier</Dropdown.Item>
      <Dropdown.Item onClick={handler} id="regular">Regular</Dropdown.Item>
    </DropdownButton>
  );
}

export default ChangeViewButton;