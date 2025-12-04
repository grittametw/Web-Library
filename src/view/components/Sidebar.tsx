import { Box, Grid2, Typography, List, ListItem } from '@mui/material'
import {
  DashboardOutlined, InventoryOutlined, Inventory2Outlined, CategoryOutlined,
  GroupsOutlined, HomeOutlined, ShoppingCartOutlined, FavoriteBorder,
  AssignmentIndOutlined, SupportAgentOutlined, LogoutOutlined
} from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import '@/styles/Sidebar.css'

interface SidebarProps {
  cartCount?: number
}

export default function Sidebar({ cartCount }: SidebarProps) {
  const { user, logout } = useAuth()
  const currentPath = usePathname()

  return (
    <Box
      className="sidebar d-flex flex-column p-2 py-4 shadow z-2"
      sx={{
        width: '100%',
        maxWidth: 280,
        height: '100vh',
        backgroundColor: '#fff'
      }}
    >
      <Grid2 className="d-flex justify-content-center align-items-center p-2 pb-4">
        <Link
          href="#"
          onClick={() => window.location.href = '/'}
          className="d-flex align-items-center gap-3 text-decoration-none text-dark"
        >
          <Image src="/favicon.ico" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Link>
      </Grid2>
      <Grid2 className="nav-pills flex-column mb-auto" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        {user?.role === 'admin' && (
          <List className="nav pb-4" sx={{ borderBottom: '1px solid #ccc' }}>
            <ListItem className="nav-item">
              <Link
                href="/admin/dashboard"
                className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/admin/dashboard' ? 'active' : ''}`}
              >
                <DashboardOutlined />
                <Typography fontSize={22}>Dashboard</Typography>
              </Link>
            </ListItem>

            <ListItem className="nav-item">
              <Link
                href="#"
                onClick={() => window.location.href = '/admin/orders'}
                className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/admin/orders' ? 'active' : ''}`}
              >
                <InventoryOutlined />
                <Typography fontSize={22}>Orders</Typography>
              </Link>
            </ListItem>

            <ListItem className="nav-item">
              <Link
                href="#"
                onClick={() => window.location.href = '/admin/products'}
                className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/admin/products' ? 'active' : ''}`}
              >
                <Inventory2Outlined />
                <Typography fontSize={22}>Products</Typography>
              </Link>
            </ListItem>

            <ListItem className="nav-item">
              <Link
                href="#"
                onClick={() => window.location.href = '/admin/categories'}
                className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/admin/categories' ? 'active' : ''}`}
              >
                <CategoryOutlined />
                <Typography fontSize={22}>Categories</Typography>
              </Link>
            </ListItem>

            <ListItem className="nav-item">
              <Link
                href="#"
                onClick={() => window.location.href = '/admin/customers'}
                className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/admin/customers' ? 'active' : ''}`}
              >
                <GroupsOutlined />
                <Typography fontSize={22}>Customers</Typography>
              </Link>
            </ListItem>
          </List>
        )}

        <List className="nav pb-4" sx={{ borderBottom: '1px solid #ccc' }}>
          <ListItem className="nav-item">
            <Link
              href="#"
              onClick={() => window.location.href = '/'}
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/' ? 'active' : ''}`}
            >
              <HomeOutlined />
              <Typography fontSize={22}>Home</Typography>
            </Link>
          </ListItem>

          <ListItem>
            <Link
              href="/mycart"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/mycart' ? 'active' : ''}`}
            >
              <ShoppingCartOutlined />
              <Grid2 className="d-flex justify-content-between align-items-center w-100">
                <Typography fontSize={22}>My Cart</Typography>
                {cartCount !== undefined && cartCount > 0 && (
                  <Box
                    sx={{
                      padding: '0 12px',
                      background: '#ff0f0f',
                      color: '#fff',
                      borderRadius: '24px',
                      fontSize: '24px',
                      textAlign: 'center',
                    }}
                  >
                    {cartCount}
                  </Box>
                )}
              </Grid2>
            </Link>
          </ListItem>

          <ListItem>
            <Link
              href="/favorite"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/favorite' ? 'active' : ''}`}
            >
              <FavoriteBorder />
              <Typography fontSize={22}>Favorite</Typography>
            </Link>
          </ListItem>
        </List>

        <List className="nav">
          <ListItem>
            <Link
              href="/account"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/account' ? 'active' : ''}`}
            >
              <AssignmentIndOutlined />
              <Typography fontSize={22}>Your Account</Typography>
            </Link>
          </ListItem>

          <ListItem>
            <Link
              href="/support"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/support' ? 'active' : ''}`}
            >
              <SupportAgentOutlined />
              <Typography fontSize={22}>Support</Typography>
            </Link>
          </ListItem>

          <ListItem>
            {user ? (
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault()
                  logout()
                  window.location.href = '/login'
                }}
                className={"nav-link d-flex align-items-center gap-4"}
              >
                <LogoutOutlined />
                <Typography fontSize={22}>Logout</Typography>
              </Link>
            ) : (
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault()
                  window.location.href = '/login'
                }}
                className={"nav-link d-flex align-items-center gap-4"}
              >
                <LogoutOutlined />
                <Typography fontSize={22}>Login</Typography>
              </Link>
            )}
          </ListItem>
        </List>
      </Grid2>
    </Box>
  )
}