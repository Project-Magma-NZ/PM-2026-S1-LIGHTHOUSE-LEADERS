import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthProvider'

const Navbar = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth() 

    const isAdmin = user?.role === "admin";

    const [menuOpen, setMenuOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="navbar">
            <img onClick={() => navigate('/')} src={assets.logo} alt="Lighthouse Leaders logo" className="logo" />
            <ul>
                
                {isAuthenticated ? (
                    <>  
                    {!isAdmin  && (
                        <>
                        <li>
                            <NavLink to="/dashboard" end>Dashboard</NavLink>
                        </li>
                        <li>
                            <NavLink to="/analytics">Analytics</NavLink>
                        </li>
                        </>
                        
                    )}                                             

                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink to="/adminDashboard">Admin Dashboard</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/create-survey">Create Survey</NavLink>
                                </li>
                            </>
                        )}
                    </>
                ) : (
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                )}
                
            </ul>
            <div className="profile">
                {isAuthenticated ? (
                    <div className="profile-trigger" ref={profileRef}>
                        <img className="profile-image" src={assets.profile} alt="Profile" />
                        <span className="profile-name">{user?.first_name + ' ' + user?.last_name}</span>
                        <button
                            type="button"
                            className={`dropdown-toggle${menuOpen ? ' is-open' : ''}`}
                            aria-label="Toggle profile menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <img className="dropdown-icon" src={assets.dropdown} alt="" aria-hidden="true" />
                        </button>
                        <div className={`profile-dropdown${menuOpen ? ' is-open' : ''}`}>
                            <div className="profile-dropdown-items">
                                <p
                                    onClick={() => {
                                        navigate('/profile')
                                        setMenuOpen(false)
                                    }}
                                >
                                    <img src={assets.profileIcon} alt="" aria-hidden="true" />
                                    <span>Profile</span>
                                </p>
                                <p
                                    onClick={async () => {
                                        await logout();
                                        setMenuOpen(false)
                                        navigate('/login')
                                    }}
                                >
                                    <img src={assets.logoutIcon} alt="" aria-hidden="true" />
                                    <span>Logout</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')}>Login to Account</button>
                )}
            </div>
        </div>
    )
}

export default Navbar
