"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ListTodo, Plus, ChevronDown, ChevronRight, Menu, X, Loader2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiService } from "../api/apiService"
import { useAuth } from "../hooks/useAuth"
import type { TeamMembership } from "../type/api.types"
import "../styles/PureSidebar.css";


interface SidebarProps {
  children: React.ReactNode;
}
interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}
interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);
  const itemClasses = `sidebar-item ${isActive ? "sidebar-item--active" : ""}`;

  return (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <div className={itemClasses}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

function SidebarGroup({ title, children, defaultOpen = true }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="sidebar-group">
      <button className="sidebar-group__button" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="sidebar-group__children">{children}</div>}
    </div>
  );
}

export function PureSidebar({ children }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { user } = useAuth();

  const { data: teamMemberships, isLoading, isError } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['userTeams', user?.username],
    queryFn: () => apiService.users.getTeamsForUser(user!.username),
    enabled: !!user,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  useEffect(() => { if (isDesktop) setIsMobileOpen(false); }, [isDesktop]);

  const renderTeamList = () => {
    if (isLoading) return <div className="sidebar-item"><Loader2 size={16} className="animate-spin" /> <span>Loading teams...</span></div>;
    if (isError) return <div className="sidebar-item" style={{ color: '#ef4444' }}>Failed to load</div>;
    if (teamMemberships && teamMemberships.length > 0) {
      return teamMemberships.map((membership) => (
        <SidebarItem key={membership.team.id} href={`/team-details/${membership.team.name}`} icon={<span style={{ width: '16px', textAlign: 'center' }}>#</span>} label={membership.team.name} />
      ));
    }
    return <div style={{ padding: '8px 12px', fontSize: '12px', color: '#6b7280' }}>No teams joined yet.</div>;
  };

  const sidebarClasses = `sidebar ${isDesktop ? 'sidebar--desktop' : 'sidebar--mobile'} ${isMobileOpen ? 'sidebar--mobile-open' : ''}`;

  return (
    <div className="sidebar-layout">
      {!isDesktop && isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}

      <aside className={sidebarClasses}>
        <header className="sidebar__header">
          <Link to="/dashboard" className="sidebar__logo">
            <div className="sidebar__logo-icon"><ListTodo size={16} /></div>
            <span className="sidebar__logo-text">TeamTodo</span>
          </Link>
          {!isDesktop && <button className="mobile-header__button" onClick={() => setIsMobileOpen(false)}><X size={16} /></button>}
        </header>

        <nav className="sidebar__nav">
          <SidebarItem href="/dashboard" icon={<ListTodo size={16} />} label="My Tasks" />
          <SidebarGroup title="Teams">{renderTeamList()}</SidebarGroup>
        </nav>

        <footer className="sidebar__footer">
          <Link to="/create-team" className="sidebar__footer-button">
              <Plus size={16} /> Create Team
            </Link>
          {/* {canManageTeams && (
            
          )} */}
        </footer>
      </aside>

      <div className="main-content">
        {!isDesktop && (
          <header className="mobile-header">
            <button className="mobile-header__button" onClick={() => setIsMobileOpen(true)}><Menu size={16} /></button>
          </header>
        )}
        <main className="main-content__page">{children}</main>
      </div>
    </div>
  );
}

export { SidebarItem, SidebarGroup };