import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function Sidebar() {

  return (
    <body>
      <div className="d-flex flex-column flex-shrink-0 p-4" style={{ width: '300px', height: '100vh', backgroundColor: '#fff' }}>
        <a href="/" className="d-flex justify-content-center p-2 pb-5">
          <img src="icon_web.png" alt="" width={'140px'} />
        </a>

        <div className="nav-pills flex-column mb-auto">
          <ul className="nav p-4 gap-2" style={{ borderBottom: '1px solid #ebedf4' }}>
            <li className="nav-item d-flex align-items-center">
              <a href="#" className="nav-link active p-2" aria-current="page">
                <HomeOutlinedIcon />
              </a>
              <a href="#" className="nav-link" aria-current="page">
                Home
              </a>
            </li>
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <CategoryOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                Category
              </a>
            </li>
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <LocalLibraryOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                My Library
              </a>
            </li>
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <FavoriteBorderOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                Favourite
              </a>
            </li>
          </ul>
          <ul className="nav p-4 gap-2">
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <SettingsOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                Settings
              </a>
            </li>
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <SupportAgentOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                Support
              </a>
            </li>
            <li className="d-flex align-items-center">
              <a href="#" className="nav-link disabled p-2">
                <LogoutOutlinedIcon />
              </a>
              <a href="#" className="nav-link disabled">
                Logout
              </a>
            </li>
          </ul>
        </div>

      </div>
    </body>
  );
}
