// import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function VotingForm(props) {
//     //candidates name
//     //Remember: index must be same as array provided while deploying contract
//     const candidates = [
//         { id: '0', name: "Candidate-1"},
//         { id: '1', name: "Candidate-2"},
//         { id: '2', name: "Candidate-3"},
//         {id : '3', name: "Candidate-4"}
//     ];
//     const handleVote = async (id) => {
//         try{
//             //call vote function
//             const res = await props.contract.methods.vote(id).send({from : props.account});
//             props.setVotestatus(res);
//             console.log(res)
//         }
//         catch(error){
//             //show error
//           alert(error);
//         }
//     };

//     return (
//         <div className="container vh-100 ">
//             <div className="card shadow-lg p-4" style={{ width: "30rem" }}>
//                 <h3 className="text-center text-primary">Submit Your Vote</h3>
//                 <ul className="list-group mt-3">
//                     {candidates.map((candidate) => (
//                         <li key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
//                             <span className="fw-bold">{candidate.name}</span>
//                             <button 
//                                 onClick={() => handleVote(candidate.id)} 
//                                 className="btn btn-success"
//                             >
//                               Vote
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//                <p className="fw-bold" style={{paddingTop : "4px"}}> Your account : {props.account} </p>
//             </div>
//         </div>
        
//     );
// }
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaVoteYea,
  FaCheckCircle,
  FaTimesCircle,
  FaMoon,
  FaSun,
  FaWallet,
  FaClock,
  FaUserCheck,
  FaAward,
  FaInfoCircle,
  FaLock,
  FaUnlock,
} from 'react-icons/fa';

// Mock Candidates Data
const mockCandidates = [
  {
    id: 1,
    name: 'Candidate-1',
    party: 'Democratic Party',
    imgUrl: 'https://i.pravatar.cc/200?img=1',
    tagline: 'Building a Better Tomorrow',
    experience: '15 years in public service',
    votes: 0
  },
  {
    id: 2,
    name: 'Candidate-2',
    party: 'Republican Party',
    imgUrl: 'https://i.pravatar.cc/200?img=2',
    tagline: 'Strength Through Unity',
    experience: '12 years in government',
    votes: 0
  },
  {
    id: 3,
    name: 'Candidate-3',
    party: 'Independent',
    imgUrl: 'https://i.pravatar.cc/200?img=3',
    tagline: 'Change We Need',
    experience: '8 years community leader',
    votes: 0
  },
  {
    id: 4,
    name: 'Candidate-4',
    party: 'Green Party',
    imgUrl: 'https://i.pravatar.cc/200?img=4',
    tagline: 'Sustainable Future for All',
    experience: '10 years environmental work',
    votes: 0
  },
  {
    id: 5,
    name: 'Candidate-5',
    party: 'Libertarian',
    imgUrl: 'https://i.pravatar.cc/200?img=5',
    tagline: 'Freedom and Prosperity',
    experience: '6 years business leadership',
    votes: 0
  },
];

const VotingForm = (props) => {
  const [darkMode, setDarkMode] = useState(true);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [votingStatus, setVotingStatus] = useState('Active'); // Not Started, Active, Ended
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const [isVerified, setIsVerified] = useState(true); // Mock verification status
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
  },[candidates])
  // Countdown Timer Effect
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

  // Theme Effect
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f0f1e' : '#f8f9fa';
    document.body.style.color = darkMode ? '#e2e8f0' : '#1e293b';
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleVoteClick = (candidate) => {
    if (hasVoted) {
      toast.error('❌ You have already voted!', { theme: darkMode ? 'dark' : 'light' });
      return;
    }
    if (votingStatus !== 'Active') {
      toast.warning('⚠️ Voting is not currently active!', { theme: darkMode ? 'dark' : 'light' });
      return;
    }
    if (!isVerified) {
      toast.error('❌ Your account is not verified!', { theme: darkMode ? 'dark' : 'light' });
      return;
    }
    setSelectedCandidate(candidate);
    setShowConfirmModal(true);
  };

  const confirmVote = async() => {
    // Simulate blockchain transaction
    toast.info('🔄 Processing your vote on blockchain...', { theme: darkMode ? 'dark' : 'light' });
    try{
      //call vote function
      const res = await props.contract.methods.vote(selectedCandidate.id).send({from : props.account});
      // props.setVotestatus(res);
      console.log(res)
    }
    catch(error){
      //show error
      alert(error);
    }
    setTimeout(() => {
      setCandidates(
        candidates.map((c) =>
          c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
        )
      );
      setHasVoted(true);
      setVotedCandidateId(selectedCandidate.id);
      setShowConfirmModal(false);
      toast.success(`✅ Vote successfully cast for ${selectedCandidate.name}!`, {
        theme: darkMode ? 'dark' : 'light',
      });
    }, 2000);
  };

  const cancelVote = () => {
    setSelectedCandidate(null);
    setShowConfirmModal(false);
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
      },
    }),
    hover: {
      scale: 1.03,
      boxShadow: darkMode
        ? '0 20px 60px rgba(99, 102, 241, 0.4)'
        : '0 20px 60px rgba(99, 102, 241, 0.2)',
    },
  };

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

      <nav
        className="navbar sticky-top"
        style={{
          ...glassmorphStyle,
          marginBottom: '0',
        }}
      >
        <div className="container-fluid px-4">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
            <FaVoteYea className="me-2" style={{ color: '#6366f1' }} size={28} />
            <span className="fw-bold">Blockchain Voting</span>
          </span>

          <div className="d-flex align-items-center gap-3">
            <motion.div
              className="badge px-3 py-2 d-none d-md-flex align-items-center gap-2"
              style={{
                background:
                  votingStatus === 'Active'
                    ? '#10b981'
                    : votingStatus === 'Ended'
                    ? '#ef4444'
                    : '#f59e0b',
                fontSize: '0.9rem',
              }}
              whileHover={{ scale: 1.05 }}
            >
              {votingStatus === 'Active' ? <FaUnlock /> : <FaLock />}
              {votingStatus}
            </motion.div>

            {/* Verification Status */}
            {isVerified && (
              <motion.div
                className="badge bg-success px-3 py-2 d-none d-sm-flex align-items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <FaUserCheck />
                Verified
              </motion.div>
            )}

            {/* Wallet Address */}
            <motion.div
              className="btn btn-outline-primary d-none d-lg-flex align-items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWallet />
              <span className="font-monospace">{props.account || '0x742d...8f4e'}</span>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              className="btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              style={{ color: darkMode ? '#fbbf24' : '#6366f1' }}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-5">
            <motion.h1
              className="display-4 fw-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Cast Your Vote
            </motion.h1>
            <p className="lead" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Your voice matters. Choose your candidate wisely.
            </p>
          </div>
        </motion.div>

        {votingStatus === 'Active' && (
          <motion.div
            style={glassmorphStyle}
            className="p-4 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="row align-items-center">
              <div className="col-md-3 text-center text-md-start mb-3 mb-md-0">
                <h5 className="mb-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  <FaClock style={{ color: '#6366f1' }} />
                  Time Remaining
                </h5>
              </div>
              <div className="col-md-9">
                <div className="d-flex justify-content-around justify-content-md-end gap-4">
                  <div className="text-center">
                    <motion.div
                      className="display-5 fw-bold"
                      style={{ color: '#6366f1' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {String(countdown.hours).padStart(2, '0')}
                    </motion.div>
                    <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Hours</small>
                  </div>
                  <div className="display-5 fw-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>:</div>
                  <div className="text-center">
                    <motion.div
                      className="display-5 fw-bold"
                      style={{ color: '#8b5cf6' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      {String(countdown.minutes).padStart(2, '0')}
                    </motion.div>
                    <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Minutes</small>
                  </div>
                  <div className="display-5 fw-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>:</div>
                  <div className="text-center">
                    <motion.div
                      className="display-5 fw-bold"
                      style={{ color: '#ec4899' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    >
                      {String(countdown.seconds).padStart(2, '0')}
                    </motion.div>
                    <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Seconds</small>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {hasVoted && (
          <motion.div
            className="alert alert-success d-flex align-items-center gap-3 mb-4"
            style={{
              ...glassmorphStyle,
              background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaCheckCircle size={24} style={{ color: '#10b981' }} />
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: '#10b981' }}>Vote Successfully Recorded!</h6>
              <small style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                Your vote has been securely recorded on the blockchain. Thank you for participating!
              </small>
            </div>
          </motion.div>
        )}

        <motion.div
          className="alert alert-info d-flex align-items-start gap-3 mb-4"
          style={{
            ...glassmorphStyle,
            background: darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaInfoCircle size={20} style={{ color: '#6366f1', marginTop: '2px' }} />
          <div style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
            <small>
              <strong>Important:</strong> Each wallet address can vote only once. Your vote is final and cannot be changed. 
              All votes are recorded on the blockchain for transparency and security.
            </small>
          </div>
        </motion.div>

        <div className="row g-4 mb-5">
          {candidates.map((candidate, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={candidate.id}>
              <motion.div
                style={{
                  ...glassmorphStyle,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="h-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={!hasVoted && votingStatus === 'Active' ? 'hover' : {}}
              >
                {/* Voted Badge */}
                {hasVoted && votedCandidateId === candidate.id && (
                  <motion.div
                    className="position-absolute top-0 end-0 m-3 badge bg-success px-3 py-2 d-flex align-items-center gap-2"
                    style={{ zIndex: 10, fontSize: '0.85rem' }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <FaCheckCircle />
                    Your Vote
                  </motion.div>
                )}

                <div className="card-body p-4">
                  {/* Candidate image */}
                  <div className="text-center mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <img
                        src={candidate.imgUrl}
                        alt={candidate.name}
                        className="rounded-circle mb-3"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          border: `4px solid ${
                            hasVoted && votedCandidateId === candidate.id ? '#10b981' : '#6366f1'
                          }`,
                          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                        }}
                      />
                    </motion.div>
                    <h5 className="fw-bold mb-1" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                      {candidate.name}
                    </h5>
                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                      {candidate.party}
                    </p>
                  </div>

                  {/* Candidate Details */}
                  <div className="mb-3">
                    <div
                      className="p-3 rounded-3 mb-2"
                      style={{
                        background: darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                      }}
                    >
                      <small className="d-block mb-1 fw-bold" style={{ color: '#6366f1' }}>
                        Campaign tagline:
                      </small>
                      <small style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                        "{candidate.tagline}"
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaAward style={{ color: '#f59e0b' }} />
                      <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        {candidate.experience}
                      </small>
                    </div>
                  </div>

                  {/* Current Vote Count */}
                  {/* <div
                    className="text-center py-2 px-3 rounded-3 mb-3"
                    style={{
                      background: darkMode
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    }}
                  >
                    <small className="d-block" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Current Votes
                    </small>
                    <motion.div
                      className="h4 fw-bold mb-0"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      key={candidate.votes}
                      initial={{ scale: 1.5, color: '#10b981' }}
                      animate={{ scale: 1 }}
                    >
                      {candidate.votes.toLocaleString()}
                    </motion.div>
                  </div> */}

                  {/* Vote Button */}
                  <motion.button
                    className={`btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                      hasVoted || votingStatus !== 'Active'
                        ? 'btn-secondary'
                        : 'btn-primary'
                    }`}
                    onClick={() => handleVoteClick(candidate)}
                    disabled={hasVoted || votingStatus !== 'Active' || !isVerified}
                    whileHover={
                      !hasVoted && votingStatus === 'Active'
                        ? { scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)' }
                        : {}
                    }
                    whileTap={!hasVoted && votingStatus === 'Active' ? { scale: 0.95 } : {}}
                    style={{
                      fontSize: '1rem',
                      background:
                        hasVoted || votingStatus !== 'Active'
                          ? darkMode
                            ? '#64748b'
                            : '#94a3b8'
                          : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none',
                    }}
                  >
                    {hasVoted ? (
                      <>
                        <FaCheckCircle />
                        Voted
                      </>
                    ) : votingStatus !== 'Active' ? (
                      <>
                        <FaLock />
                        Voting Closed
                      </>
                    ) : (
                      <>
                        <FaVoteYea />
                        Vote Now
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Voting Statistics */}
        <motion.div
          style={glassmorphStyle}
          className="p-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h5 className="mb-3" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
            Voting Statistics
          </h5>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-3"
                style={{
                  background: darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                }}
              >
                <small className="d-block mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Total Votes
                </small>
                <div className="h4 fw-bold mb-0" style={{ color: '#6366f1' }}>
                  {candidates.reduce((sum, c) => sum + c.votes, 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-3"
                style={{
                  background: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                }}
              >
                <small className="d-block mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Candidates
                </small>
                <div className="h4 fw-bold mb-0" style={{ color: '#8b5cf6' }}>
                  {candidates.length}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-3"
                style={{
                  background: darkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)',
                }}
              >
                <small className="d-block mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Your Status
                </small>
                <div className="h4 fw-bold mb-0" style={{ color: '#ec4899' }}>
                  {hasVoted ? 'Voted' : 'Pending'}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-3"
                style={{
                  background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                }}
              >
                <small className="d-block mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Status
                </small>
                <div className="h4 fw-bold mb-0" style={{ color: '#10b981' }}>
                  {votingStatus}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedCandidate && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelVote}
          >
            <motion.div
              style={{
                ...glassmorphStyle,
                maxWidth: '500px',
                width: '90%',
              }}
              className="p-5"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <FaVoteYea size={60} style={{ color: '#6366f1' }} />
                </motion.div>
                <h3 className="mt-3 fw-bold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  Confirm Your Vote
                </h3>
                <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Please confirm that you want to cast your vote for:
                </p>
              </div>

              <div className="text-center mb-4">
                <img
                  src={selectedCandidate.imgUrl}
                  alt={selectedCandidate.name}
                  className="rounded-circle mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    border: '4px solid #6366f1',
                  }}
                />
                <h4 className="fw-bold mb-1" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  {selectedCandidate.name}
                </h4>
                <p className="mb-0" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {selectedCandidate.party}
                </p>
              </div>

              <div
                className="alert alert-warning mb-4 d-flex align-items-start gap-2"
                style={{
                  background: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <FaInfoCircle style={{ color: '#f59e0b', marginTop: '2px' }} />
                <small style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                  <strong>Warning:</strong> This action is final and cannot be undone. Your vote will be recorded on the blockchain.
                </small>
              </div>

              <div className="d-flex gap-3">
                <motion.button
                  className="btn btn-outline-secondary flex-fill py-3 fw-bold"
                  onClick={cancelVote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimesCircle className="me-2" />
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-primary flex-fill py-3 fw-bold"
                  onClick={confirmVote}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                  }}
                >
                  <FaCheckCircle className="me-2" />
                  Confirm Vote
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingForm;