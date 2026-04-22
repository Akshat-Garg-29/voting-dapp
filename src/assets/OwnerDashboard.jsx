import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaVoteYea,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaCog,
  FaPoll,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaWallet,
  FaPlay,
  FaStop,
  FaSync,
  FaDownload,
  FaCheck,
  FaTimes as FaReject,
  FaCrown,
  FaMedal,
  FaAward,
  FaUserPlus,
  FaUserCheck,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock Data
const mockCandidates = [
  { id: 1, name: 'Candidate-1', org: 'Democratic org', votes: 4250, imgUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Candidate-2', org: 'Republican org', votes: 3890, imgUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Candidate-3', org: 'Independent', votes: 2340, imgUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Candidate-4', org: 'Green org', votes: 1560, imgUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Candidate-5', org: 'Libertarian', votes: 890, imgUrl: 'https://i.pravatar.cc/150?img=5' },
];

const mockUsers = [
  { id: 1, name: 'John Doe', wallet: '0x742d...8f4e', status: 'Pending', registeredAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', wallet: '0x8a3c...2d1f', status: 'Verified', registeredAt: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', wallet: '0x1f5b...9c3a', status: 'Pending', registeredAt: '2024-01-16' },
  { id: 4, name: 'Sarah Wilson', wallet: '0x9e2d...4b7c', status: 'Rejected', registeredAt: '2024-01-13' },
];

// const votingTrendData = [
//   { time: '9:00', votes: 320 },
//   { time: '10:00', votes: 580 },
//   { time: '11:00', votes: 920 },
//   { time: '12:00', votes: 1450 },
//   { time: '13:00', votes: 1890 },
//   { time: '14:00', votes: 2340 },
// ];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const OwnerDashboard = (props) => {
  const [activeView, setActiveView] = useState('voting');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [votingStatus, setVotingStatus] = useState('Not Started'); // Not Started, Active, Ended
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const [userSubTab, setUserSubTab] = useState('registration');
  const [candidates, setCandidates] = useState(mockCandidates);
  const [users, setUsers] = useState(mockUsers);
  const [totalVotes,setTotalVotes] = useState(0);
  // Form States
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    wallet: '',
    idProof: null,
  });

  const host = "http://localhost:8080"
  useEffect(()=>{
    async function fetchdata(){
      const url = `${host}/candidate/get`
      let res = await fetch(url,{
        method : "GET",
        headers : {
          "Content-Type" : 'application/json'
        }
      })
      const can = await res.json()
      const updatedCand = can.map((c,index) => ({
        ...c,
        id : index+1
      }));
      setCandidates(updatedCand)
    }
    fetchdata();
  },[])
  useEffect(() => {
    if (votingStatus === 'Active') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return prev;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [votingStatus]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f0f1e' : '#f8f9fa';
    document.body.style.color = darkMode ? '#e2e8f0' : '#1e293b';
  }, [darkMode]);
  

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const startVoting = () => {
    setVotingStatus('Active');
    toast.success('🗳️ Voting has started!', { position: 'top-right', theme: darkMode ? 'dark' : 'light' });
  };

  const endVoting = () => {
    setVotingStatus('Ended');
    toast.info('🛑 Voting has ended!', { position: 'top-right', theme: darkMode ? 'dark' : 'light' });
  };
  
  const fetchBlockChainData = async() =>{
    try{
      const res1 = await props.contract.methods.getVotes().call({from : props.account});
      const res2 = await props.contract.methods.totalVotes().call({from : props.account});
      const parsed = res1.map((item) => item.toString());
      const updatedCand = candidates.map((c,index) => ({
        ...c,
        votes: Number(parsed[index]),
      }));
      console.log(updatedCand)
      setCandidates(updatedCand)
      updatedCand.forEach(async (can)=>{
        const url = `${host}/candidate/${can._id}`
        const res = await fetch(url,{
          method : "PUT",
          headers : {
            "Content-Type" : 'application/json'
          },
          body : JSON.stringify(can)
        })
        // console.log(res)
      })
      setTotalVotes(res2.toString())
      console.log(parsed)
      console.log(res2.toString())
    }
    catch(error){
      //show error
      alert(error);
    }
  }
  const handleRegisterUser = (e) => {
    e.preventDefault();
    toast.success('✅ User registered successfully!', { theme: darkMode ? 'dark' : 'light' });
    setRegistrationForm({ name: '', wallet: '', idProof: null });
  };

  const verifyUser = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'Verified' } : u)));
    toast.success('✅ User verified!', { theme: darkMode ? 'dark' : 'light' });
  };

  const rejectUser = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'Rejected' } : u)));
    toast.error('❌ User rejected!', { theme: darkMode ? 'dark' : 'light' });
  };

  const refreshVotes = () => {
    toast.info('🔄 Refreshing vote counts...', { theme: darkMode ? 'dark' : 'light' });
  };

  const maxVotes = Math.max(...candidates.map((c) => c.votes));
  const topThree = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 3);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  // Styles
  const glassmorphStyle = {
    background: darkMode ? 'rgba(30, 30, 60, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: darkMode ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    boxShadow: darkMode
      ? '0 8px 32px 0 rgba(99, 102, 241, 0.15)'
      : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    margin: '4px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive
      ? darkMode
        ? 'rgba(99, 102, 241, 0.2)'
        : 'rgba(99, 102, 241, 0.1)'
      : 'transparent',
    color: isActive ? '#6366f1' : darkMode ? '#cbd5e1' : '#64748b',
    fontWeight: isActive ? '600' : '400',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <ToastContainer />

      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg sticky-top"
        style={{
          ...glassmorphStyle,
          marginBottom: '0',
        }}
      >
        <div className="container-fluid px-4">
          <button
            className="btn me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <span className="navbar-brand mb-0 h1" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
            <FaVoteYea className="me-2" style={{ color: '#6366f1' }} />
            Blockchain Voting Admin
          </span>

          <div className="ms-auto d-flex align-items-center gap-3">
            <motion.button
              className="btn btn-outline-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWallet className="me-2" />
              {props.account}
            </motion.button>

            <motion.button
              className="btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              style={{ color: darkMode ? '#fbbf24' : '#6366f1' }}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </motion.button>

            <img
              src="https://i.pravatar.cc/40?img=10"
              alt="Admin"
              className="rounded-circle"
              style={{ width: '40px', height: '40px', border: '2px solid #6366f1' }}
            />
          </div>
        </div>
      </nav>

      <div className="d-flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="p-3"
              style={{
                width: '280px',
                height: 'calc(100vh - 70px)',
                position: 'sticky',
                top: '70px',
                overflowY: 'auto',
              }}
            >
              <div style={glassmorphStyle} className="p-3 h-100">
                <div className="mb-4">
                  <h6
                    className="text-uppercase fw-bold"
                    style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : '#64748b' }}
                  >
                    Main Menu
                  </h6>
                </div>

                <div style={navItemStyle(activeView === 'voting')} onClick={() => setActiveView('voting')}>
                  <FaPoll size={18} />
                  {sidebarOpen && <span>Voting Control</span>}
                </div>

                <div style={navItemStyle(activeView === 'votes')} onClick={() => setActiveView('votes')}>
                  <FaChartBar size={18} />
                  {sidebarOpen && <span>Vote Count</span>}
                </div>

                <div style={navItemStyle(activeView === 'leaderboard')} onClick={() => setActiveView('leaderboard')}>
                  <FaTrophy size={18} />
                  {sidebarOpen && <span>Leaderboard</span>}
                </div>

                <div style={navItemStyle(activeView === 'analytics')} onClick={() => setActiveView('analytics')}>
                  <FaChartBar size={18} />
                  {sidebarOpen && <span>Analytics</span>}
                </div>

                {/* <div style={navItemStyle(activeView === 'users')} onClick={() => setActiveView('users')}>
                  <FaUsers size={18} />
                  {sidebarOpen && <span>User Management</span>}
                </div> */}

                <div style={navItemStyle(activeView === 'settings')} onClick={() => setActiveView('settings')}>
                  <FaCog size={18} />
                  {sidebarOpen && <span>Settings</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-grow-1 p-4" style={{ maxWidth: sidebarOpen ? 'calc(100% - 280px)' : '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Voting Control Page */}
              {activeView === 'voting' && (
                <div>
                  <h2 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                    Voting Control
                  </h2>

                  <div className="row g-4">
                    <div className="col-md-4">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4 text-center"
                        whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)' }}
                      >
                        <h5 style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Voting Status</h5>
                        <span
                          className={`badge mt-3 px-4 py-2 fs-6`}
                          style={{
                            background:
                              votingStatus === 'Active'
                                ? '#10b981'
                                : votingStatus === 'Ended'
                                ? '#ef4444'
                                : '#f59e0b',
                          }}
                        >
                          {votingStatus}
                        </span>
                      </motion.div>
                    </div>

                    <div className="col-md-8">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4"
                        whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)' }}
                      >
                        <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                          Time Remaining
                        </h5>
                        <div className="d-flex justify-content-around">
                          <div className="text-center">
                            <div
                              className="display-4 fw-bold"
                              style={{ color: '#6366f1' }}
                            >{countdown.hours}</div>
                            <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Hours</small>
                          </div>
                          <div className="text-center">
                            <div
                              className="display-4 fw-bold"
                              style={{ color: '#8b5cf6' }}
                            >{countdown.minutes}</div>
                            <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Minutes</small>
                          </div>
                          <div className="text-center">
                            <div
                              className="display-4 fw-bold"
                              style={{ color: '#ec4899' }}
                            >{countdown.seconds}</div>
                            <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Seconds</small>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="col-12">
                      <motion.div style={glassmorphStyle} className="p-4">
                        <div className="d-flex gap-3 justify-content-center">
                          <motion.button
                            className="btn btn-success btn-lg px-5"
                            onClick={startVoting}
                            disabled={votingStatus === 'Active'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPlay className="me-2" />
                            Start Voting
                          </motion.button>

                          <motion.button
                            className="btn btn-danger btn-lg px-5"
                            onClick={endVoting}
                            disabled={votingStatus !== 'Active'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaStop className="me-2" />
                            End Voting
                          </motion.button>
                          <motion.button
                            className="btn btn-info btn-lg px-5"
                            onClick={fetchBlockChainData}
                            disabled={votingStatus === 'Active'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* <FaStop className="spin" /> */}
                             Fetch Data
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vote Count Page */}
              {activeView === 'votes' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Vote Count</h2>
                    <div className="d-flex gap-2">
                      <motion.button
                        className="btn btn-primary"
                        onClick={refreshVotes}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, rotate: 180 }}
                      >
                        <FaSync className="me-2" />
                        Refresh
                      </motion.button>
                      <motion.button
                        className="btn btn-outline-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaDownload className="me-2" />
                        Export
                      </motion.button>
                    </div>
                  </div>

                  <motion.div style={glassmorphStyle} className="p-4">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr style={{ borderBottom: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' }}>
                            <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>ID</th>
                            <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Candidate Name</th>
                            <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>org</th>
                            <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Vote Count</th>
                            <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.map((candidate, index) => (
                            <motion.tr
                              key={candidate.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              style={{ borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}
                            >
                              <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{candidate.id}</td>
                              <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{candidate.name}</td>
                              <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{candidate.org}</td>
                              <td>
                                <motion.span
                                  className="fw-bold"
                                  style={{ color: '#6366f1', fontSize: '1.1rem' }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                >
                                  {candidate.votes.toLocaleString()}
                                </motion.span>
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    background: candidate.votes === maxVotes ? '#10b981' : '#64748b',
                                  }}
                                >
                                  {candidate.votes === maxVotes ? 'Leading' : 'Trailing'}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Leaderboard Page */}
              {activeView === 'leaderboard' && (
                <div>
                  <h2 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                    Leaderboard
                  </h2>

                  <div className="row g-4 mb-5">
                    {topThree.map((candidate, index) => (
                      <div className="col-md-4" key={candidate.id}>
                        <motion.div
                          style={{
                            ...glassmorphStyle,
                            background:
                              index === 0
                                ? darkMode
                                  ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(99, 102, 241, 0.2))'
                                  : 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(99, 102, 241, 0.1))'
                                : glassmorphStyle.background,
                          }}
                          className="p-4 text-center position-relative"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)',
                          }}
                        >
                          {index === 0 && (
                            <motion.div
                              className="position-absolute top-0 end-0 m-3"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <FaCrown size={30} color="#eab308" />
                            </motion.div>
                          )}

                          <motion.div
                            className="mb-3"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {index === 0 ? (
                              <FaCrown size={50} color="#eab308" />
                            ) : index === 1 ? (
                              <FaMedal size={50} color="#9ca3af" />
                            ) : (
                              <FaAward size={50} color="#cd7f32" />
                            )}
                          </motion.div>

                          <img
                            src={candidate.imgUrl}
                            alt={candidate.name}
                            className="rounded-circle mb-3"
                            style={{
                              width: '100px',
                              height: '100px',
                              border: `4px solid ${
                                index === 0 ? '#eab308' : index === 1 ? '#9ca3af' : '#cd7f32'
                              }`,
                            }}
                          />

                          <h5 style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{candidate.name}</h5>
                          <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>{candidate.org}</p>

                          <motion.div
                            className="display-6 fw-bold"
                            style={{ color: '#6366f1' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.2 + 0.3, type: 'spring' }}
                          >
                            {candidate.votes.toLocaleString()}
                          </motion.div>
                          <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>votes</small>
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <motion.div
                    style={glassmorphStyle}
                    className="p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                      Vote Distribution
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={candidates}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                        <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                        <Tooltip
                          contentStyle={{
                            background: darkMode ? '#1e293b' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="votes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              )}

              {/* Analytics Page */}
              {activeView === 'analytics' && (
                <div>
                  <h2 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                    Analytics Dashboard
                  </h2>

                  <div className="row g-4 mb-4">
                    {[
                      { title: 'Total Registered Voters', value: 10, icon: <FaUsers size={30} />, color: '#6366f1' },
                      { title: 'Total Votes Cast', value: totalVotes, icon: <FaVoteYea size={30} />, color: '#8b5cf6' },
                      { title: 'Total Candidates', value: candidates.length, icon: <FaUserPlus size={30} />, color: '#ec4899' },
                      { title: 'Participation Rate', value: totalVotes*10+"%", icon: <FaChartBar size={30} />, color: '#10b981' },
                    ].map((stat, index) => (
                      <div className="col-md-3" key={index}>
                        <motion.div
                          style={glassmorphStyle}
                          className="p-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, boxShadow: `0 12px 40px ${stat.color}40` }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div style={{ color: stat.color }}>{stat.icon}</div>
                            <motion.div
                              className="display-6 fw-bold"
                              style={{ color: stat.color }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                            >
                              {stat.value}
                            </motion.div>
                          </div>
                          <p className="mb-0" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {stat.title}
                          </p>
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <div className="row g-4">
                    {/* <div className="col-md-8">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                          Voting Trend
                        </h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={votingTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                            <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                            <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                            <Tooltip
                              contentStyle={{
                                background: darkMode ? '#1e293b' : '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="votes"
                              stroke="#6366f1"
                              strokeWidth={3}
                              dot={{ fill: '#6366f1', r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div> */}

                    <div className="col-md-14">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                          Vote Share
                        </h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={candidates}
                              dataKey="votes"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              label
                            >
                              {candidates.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: darkMode ? '#274472' : '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management Page */}
              {/* {activeView === 'users' && (
                <div>
                  <h2 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                    User Management
                  </h2>

                  <motion.div style={glassmorphStyle} className="p-4">
                    <ul className="nav nav-tabs mb-4" style={{ borderBottom: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' }}>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${userSubTab === 'registration' ? 'active' : ''}`}
                          onClick={() => setUserSubTab('registration')}
                          style={{
                            color: userSubTab === 'registration' ? '#6366f1' : darkMode ? '#94a3b8' : '#64748b',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: userSubTab === 'registration' ? '2px solid #6366f1' : 'none',
                          }}
                        >
                          <FaUserPlus className="me-2" />
                          User Registration
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${userSubTab === 'verification' ? 'active' : ''}`}
                          onClick={() => setUserSubTab('verification')}
                          style={{
                            color: userSubTab === 'verification' ? '#6366f1' : darkMode ? '#94a3b8' : '#64748b',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: userSubTab === 'verification' ? '2px solid #6366f1' : 'none',
                          }}
                        >
                          <FaUserCheck className="me-2" />
                          Verify Users
                        </button>
                      </li>
                    </ul>

                    {userSubTab === 'registration' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <form onSubmit={handleRegisterUser}>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  placeholder="Full Name"
                                  value={registrationForm.name}
                                  onChange={(e) =>
                                    setRegistrationForm({ ...registrationForm, name: e.target.value })
                                  }
                                  style={{
                                    background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    color: darkMode ? '#e2e8f0' : '#1e293b',
                                  }}
                                  required
                                />
                                <label htmlFor="name" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                                  Full Name
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="wallet"
                                  placeholder="Wallet Address"
                                  value={registrationForm.wallet}
                                  onChange={(e) =>
                                    setRegistrationForm({ ...registrationForm, wallet: e.target.value })
                                  }
                                  style={{
                                    background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    color: darkMode ? '#e2e8f0' : '#1e293b',
                                  }}
                                  required
                                />
                                <label htmlFor="wallet" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                                  Wallet Address
                                </label>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                  ID Proof Upload
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) =>
                                    setRegistrationForm({ ...registrationForm, idProof: e.target.files[0] })
                                  }
                                  style={{
                                    background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    color: darkMode ? '#e2e8f0' : '#1e293b',
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-12">
                              <motion.button
                                type="submit"
                                className="btn btn-primary btn-lg w-100"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FaUserPlus className="me-2" />
                                Register User
                              </motion.button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {userSubTab === 'verification' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr style={{ borderBottom: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' }}>
                                <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Name</th>
                                <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Wallet Address</th>
                                <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Registered</th>
                                <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Status</th>
                                <th style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user, index) => (
                                <motion.tr
                                  key={user.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  style={{ borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}
                                >
                                  <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{user.name}</td>
                                  <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                                    <code style={{ color: '#6366f1' }}>{user.wallet}</code>
                                  </td>
                                  <td style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{user.registeredAt}</td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        background:
                                          user.status === 'Verified'
                                            ? '#10b981'
                                            : user.status === 'Pending'
                                            ? '#f59e0b'
                                            : '#ef4444',
                                      }}
                                    >
                                      {user.status}
                                    </span>
                                  </td>
                                  <td>
                                    {user.status === 'Pending' && (
                                      <div className="d-flex gap-2">
                                        <motion.button
                                          className="btn btn-sm btn-success"
                                          onClick={() => verifyUser(user.id)}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <FaCheck />
                                        </motion.button>
                                        <motion.button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => rejectUser(user.id)}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <FaReject />
                                        </motion.button>
                                      </div>
                                    )}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              )} */}

              {/* Settings Page */}
              {activeView === 'settings' && (
                <div>
                  <h2 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                    Settings
                  </h2>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                          Admin Profile
                        </h5>
                        <form>
                          <div className="mb-3">
                            <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Admin User"
                              style={{
                                background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                color: darkMode ? '#e2e8f0' : '#1e293b',
                              }}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              defaultValue="admin@voting.dapp"
                              style={{
                                background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                color: darkMode ? '#e2e8f0' : '#1e293b',
                              }}
                            />
                          </div>
                          <motion.button
                            type="button"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.success('Profile updated!', { theme: darkMode ? 'dark' : 'light' })}
                          >
                            Update Profile
                          </motion.button>
                        </form>
                      </motion.div>
                    </div>

                    <div className="col-md-6">
                      <motion.div
                        style={glassmorphStyle}
                        className="p-4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <h5 className="mb-4" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                          Preferences
                        </h5>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                            Network
                          </label>
                          <select
                            className="form-select"
                            style={{
                              background: darkMode ? 'rgba(30, 30, 60, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                              border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                              color: darkMode ? '#e2e8f0' : '#1e293b',
                            }}
                          >
                            <option>Ethereum Mainnet</option>
                            <option>Polygon</option>
                            <option>BSC</option>
                            <option>Avalanche</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                            Theme
                          </label>
                          <div className="d-flex gap-2">
                            <motion.button
                              className={`btn flex-fill ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => setDarkMode(true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaMoon className="me-2" />
                              Dark
                            </motion.button>
                            <motion.button
                              className={`btn flex-fill ${!darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => setDarkMode(false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaSun className="me-2" />
                              Light
                            </motion.button>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                            Accent Color
                          </label>
                          <input
                            type="color"
                            className="form-control form-control-color w-100"
                            defaultValue="#6366f1"
                            style={{ height: '50px' }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
