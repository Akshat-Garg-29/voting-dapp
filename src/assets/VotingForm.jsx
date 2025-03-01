import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VotingForm(props) {
    //candidates name
    //Note - index must be same as array provided while deploying contract
    const candidates = [
        { id: '0', name: "Akshat"},
        { id: '1', name: "Krishnav"},
        { id: '2', name: "Harshal"},
        {id : '3' , name : "Aman"}
    ];
    const handleVote = async (id) => {
        try{
            //call vote function
            const res = await props.contract.methods.vote(id).send({from : props.account});
            props.setVotestatus(res);
            console.log(res)
        }
        catch(error){
            //show error
          alert(error);
        }
    };

    return (
        <div className="container vh-100 ">
            <div className="card shadow-lg p-4" style={{ width: "30rem" }}>
                <h3 className="text-center text-primary">Submit Your Vote</h3>
                <ul className="list-group mt-3">
                    {candidates.map((candidate) => (
                        <li key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span className="fw-bold">{candidate.name}</span>
                            <button 
                                onClick={() => handleVote(candidate.id)} 
                                className="btn btn-success"
                            >
                              Vote
                            </button>
                        </li>
                    ))}
                </ul>
               <p className="fw-bold" style={{paddingTop : "4px"}}> Your account : {props.account} </p>
            </div>
        </div>
        
    );
}
