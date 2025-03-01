import React from 'react'

export default function VoteSubmitted() {
  return (
    <div>
      <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "30rem" }}>
                <h3 className="text-center text-success">Vote Submitted</h3>
                <p className="text-center mt-3 fw-bold">
                    Thank you for casting your vote!
                </p>
            </div>
        </div>
    </div>
  )
}
