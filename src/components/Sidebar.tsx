import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function Sidebar() {

  return (
    <div>
      <div className="d-flex flex-column flex-shrink-0 p-4" style={{ width: '300px', height: '100vh', backgroundColor: '#fff' }}>
        <a href="/" className="d-flex align-items-center p-2 pb-4 gap-3">
          <img src="icon_web.png" alt="" width={'48px'} />
          Web - Library
        </a>

        <div className="nav-pills flex-column mb-auto">
          <ul className="nav p-2 pb-4 gap-2" style={{ borderBottom: '1px solid #ebedf4' }}>
            <li className="nav-item" style={{ width: '100%' }}>
              <a href="#" className="nav-link active d-flex align-items-center gap-4" aria-current="page" style={{ fontSize: '24px' }}>
                <HomeOutlinedIcon />
                Home
              </a>
            </li>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <CategoryOutlinedIcon />
                Category
              </a>
            </li>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <LocalLibraryOutlinedIcon />
                My Library
              </a>
            </li>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <FavoriteBorderOutlinedIcon />
                Favourite
              </a>
            </li>
          </ul>
          <ul className="nav p-2 pt-4gap-2" style={{ fontSize: '24px' }}>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <SettingsOutlinedIcon />
                Settings
              </a>
            </li>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <SupportAgentOutlinedIcon />
                Support
              </a>
            </li>
            <li style={{ width: '100%' }}>
              <a href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px' }}>
                <LogoutOutlinedIcon />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
