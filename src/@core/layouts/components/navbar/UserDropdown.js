// ** React Imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { isUserLoggedIn } from "@utils";
import { getUserData } from "../../../../utility/Utils";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogout } from "@store/actions/auth";

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-27.jpg";

// ** Axios
import useJwt from "@src/auth/jwt/useJwt";

// API url
import { API_URL } from "../../../../configs/constants";

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      const { userId } = getUserData();
      async function fetchData() {
        try {
          const result = await useJwt.get(`${API_URL}/users/${userId}`);
          setUserData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
      // setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name font-weight-bold">
            {(userData &&
              ((userData["firstName"] &&
                `${userData["firstName"]} ${userData["lastName"]}`) ||
                userData["authorizedPerson"])) ||
              "John Doe"}
          </span>
          {/* <span className="user-status">
            {(userData && userData.role) || "Admin"}
          </span> */}
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/my-profile">
          <User size={14} className="mr-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        {/* for now, we don't need it. So comment it */}
        {/* <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <Mail size={14} className="mr-75" />
          <span className="align-middle">Inbox</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <CheckSquare size={14} className="mr-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <MessageSquare size={14} className="mr-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="mr-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
