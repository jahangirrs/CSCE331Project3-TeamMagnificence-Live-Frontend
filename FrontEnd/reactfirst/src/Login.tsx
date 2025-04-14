import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
//import './Login.css';

//URL variable, change depending on local testing or Live push
 const BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
//const BackendURL = "http://localhost:3000/";

//front end url
const FrontendURL = "https://csce331project3-teammagnificence-live-o7uu.onrender.com/";
//const FrontendURL = "http://localhost:5173";

function Login(){
    const [userData, setUserData] = useState(Object);
    const currQuery = new URLSearchParams(window.location.search);
    const [userName, setUserName] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [isEmployee, setIsEmployee] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRedirect, setUserRedirect] = useState("");
    const [complete, setComplete] = useState(false);

    if(currQuery.get("state") == null || currQuery.get("state") != localStorage.getItem("state")) {
        localStorage.setItem("state",(Math.random() * 3000).toString());
        localStorage.setItem("nonce", (Math.random() * 1092456).toString());


    }

    const url = "https://accounts.google.com/o/oauth2/v2/auth?" +
        "response_type=code&" +
        "client_id=104092234806-rmjagmekkhhcrd303i16jd0cblcp9a8g.apps.googleusercontent.com&" +
        "scope=openid%20email&" +
        "redirect_uri=" + FrontendURL +
        "state=" + localStorage.getItem("state") + "&" +
        "login_hint=jsmith@example.com&" +
        "nonce=" + localStorage.getItem("none")

    //send code received to backend to get user data
    useEffect(() => {
        if(currQuery.get("state") != null && currQuery.get("state") === localStorage.getItem("state")) {
            fetch(BackendURL + "auth?" + "code=" + currQuery.get("code"))
                .then((res) => res.json())
                .then((data) => setUserData(jwtDecode(data)))
                .then(() => setIsLoggedIn(true))
        }
    }, [window.location.href]);

    const navigate = useNavigate();

    //send user data to backend to verify/create account
    useEffect(() => {
        if(complete) {
            fetch(BackendURL +"user?" + "id=" + userData.sub + "&name=" + userName + "&employeeID=" + employeeID + "&code=" + currQuery.get("code") )
                .then((res) => res.json())
                .then((data) => setUserRedirect(data.path) )
        }
    }, [complete]);


    useEffect(() => {
        navigate(userRedirect);
    }, [userRedirect]);

  //Resize logic
    const [fontSize, setFontSize] = useState(16);
    const changeFontSize = (action: 'Increase' | 'Decrease' | 'Default')=>{
        setFontSize((prev) => {
            if(action == 'Increase'){
                return Math.min(60, prev + 2);
            }
            if(action == 'Decrease'){ 
                return Math.max(16, prev - 2);
            }
            return 16;
        });
    };
    return(
        <div style={{ padding: '1rem'}}>
            <div style={{ marginBottom: '1rem'}}>
                <p><u>Change Font Size</u></p>
                <button onClick={() => changeFontSize('Increase')}>Increase</button>
                <button onClick={() => changeFontSize('Decrease')}>Decrease</button>
                <button onClick={() => changeFontSize('Default')}>Default</button>
            </div> 
            {/*<div style={{fontSize: fontSize + 'px'}}>*/}
            {/*    <p>This is our log in page</p>*/}
            {/*</div>*/}

        <div style={{fontSize: fontSize + 'px'}}>
            <p>Welcome to Generic Boba!</p>
            <div className={"links"}><Link to = { url }>Click Here to Login</Link></div>
            <div className={"links"}><Link to = "/Customer">Click Here to Order</Link></div>
            {isLoggedIn &&
                <div className={"questions"}>
                <label>Are you an employee?
                    <label>Yes
                        <input type="radio" name = "employee" onChange={e => {setIsEmployee(e.target.checked)} }/></label>
                    <label>No
                        <input type="radio" name = "employee"  onChange={e => {setIsEmployee(!e.target.checked) } }/></label>
                </label>
                    {isEmployee && <label>Enter your employee ID:
                <input onChange = {e => {setEmployeeID(e.target.value)}} />
                    </label>
                    }
                    <label>Please enter your name:
                        <input onChange = {e => {setUserName(e.target.value) } } />
                    </label>
                    <button onClick = {() => { setComplete(true);} }>Finish</button>
                </div>
            }

        </div>
        </div>
    );
}

export default Login;