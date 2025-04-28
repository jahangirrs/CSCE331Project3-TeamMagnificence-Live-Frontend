import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";


//URL variable, change depending on local testing or Live push
 const BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
//const BackendURL = "http://localhost:3000/";

//front end url
const FrontendURL = "https://csce331project3-teammagnificence-live-o7uu.onrender.com/";
//const FrontendURL = "http://localhost:5173";

function Login(){
    const currQuery = new URLSearchParams(window.location.search);
    const [userName, setUserName] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [isEmployee, setIsEmployee] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRedirect, setUserRedirect] = useState("");
    const [complete, setComplete] = useState(false);
    const [sub, setSub] = useState('');

    if(currQuery.get("state") == null || currQuery.get("state") != localStorage.getItem("state")) {
        localStorage.setItem("state",(Math.random() * 3000).toString());
        localStorage.setItem("nonce", (Math.random() * 1092456).toString());


    }

    const url = "https://accounts.google.com/o/oauth2/v2/auth?" +
        "response_type=code&" +
        "client_id=104092234806-rmjagmekkhhcrd303i16jd0cblcp9a8g.apps.googleusercontent.com&" +
        "scope=openid%20email&" +
        "redirect_uri=" + FrontendURL +
        "&state=" + localStorage.getItem("state") + "&" +
        "login_hint=jsmith@example.com&" +
        "nonce=" + localStorage.getItem("none")

    //send code received to backend to get user data
    useEffect(() => {
        if(currQuery.get("state") != null && currQuery.get("state") === localStorage.getItem("state")) {
            fetch(BackendURL + "auth?" + "code=" + currQuery.get("code"))
                .then((res) => res.json())
                .then((data) => {
                    if(data.exists) {
                        setUserRedirect(data.path)
                    }
                    else{
                        setIsLoggedIn(true)
                        setSub(data.sub)
                    }

                })
        }
    }, [window.location.href]);

    const navigate = useNavigate();

    //send user data to backend to create account
    useEffect(() => {
        if(complete) {
            fetch(BackendURL +"user?" + "id=" + sub + "&name=" + userName + "&employeeID="
                + employeeID + "&allergens=" + allergenList.toString() )
                .then((res) => res.json())
                .then((data) => setUserRedirect(data.path) )
        }
    }, [complete]);

    //navigation function to take user to appropriate page
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

    //get inventory from back end to get ingredients
    const [inventory, setInventory] = useState([]);
    const [allergenList, setAllergenList] = useState(new Array<string>())
    useEffect(() => {
        if(isLoggedIn) {
            fetch(BackendURL + "manager/inventory")
                .then((res) => res.json())
                .then((data) => setInventory(data))
        }
    }, [isLoggedIn]);

    //remove non-food items from inventory array
    inventory.splice(28,1);
    inventory.splice(21,3);



    return(
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', height: '100vh', margin: '0'}}>
            <div style={{ marginBottom: '1rem'}}>
                <p><u>Change Language and Font Size</u></p>
                <div id = "GoogleTranslate"></div>
                <button onClick={() => changeFontSize('Increase')}>Increase</button>
                <button onClick={() => changeFontSize('Decrease')}>Decrease</button>
                <button onClick={() => changeFontSize('Default')}>Default</button>
            </div> 
            {/*<div style={{fontSize: fontSize + 'px'}}>*/}
            {/*    <p>This is our log in page</p>*/}
            {/*</div>*/}

        <div style={{fontSize: fontSize + 'px', margin: 'auto', justifyContent: 'center', }}>
            <p style={{fontSize: '50pt'}}>Welcome to Generic Boba!</p>
            <div style = {{display: 'flex', justifyContent: 'center', gap: '10pt'}}>
            <button className={"links"}><Link style = {{color: 'white'}} to = { url }>Click Here to Login/ Create Account</Link></button>
            <button className={"links"}><Link style = {{color: 'white'}} to = "/Customer">Click Here to Order</Link></button>
            </div>
            {isLoggedIn &&
                <div className={"questions"} >
                <label>Are you an employee?
                    <label style={{display: 'list-item', listStyleType: 'none'}}>Yes
                        <input type="radio" name = "employee" onChange={e => {setIsEmployee(e.target.checked)} }/></label>
                    <label style={{display: 'list-item', listStyleType: 'none'}}>No
                        <input type="radio" name = "employee"  onChange={e => {setIsEmployee(!e.target.checked) } }/></label>
                </label>
                    {isEmployee && <label>Enter your employee ID:
                <input onChange = {e => {setEmployeeID(e.target.value)}} />
                    </label>
                    }
                    <label style={{display: 'list-item', listStyleType: 'none'}}>Please enter your name:
                        <input onChange = {e => {setUserName(e.target.value) } } />
                    </label>
                    {!isEmployee &&
                    <label style={{display: 'list-item', listStyleType: 'none'}}>Please select any allergens you may have:
                        <div>
                            {inventory.map((item:any) =>
                                <label style={{display: 'list-item', listStyleType: 'none'}}>
                                    <input type="checkbox" name = "allergens" onChange={e => {
                                        if(e.target.checked) {
                                            allergenList.push(item.name)
                                        }
                                        else {
                                            setAllergenList(allergenList.filter(allergenItem => allergenItem != item.name ) )
                                        }
                                    } }/>
                                    {item.name}
                                </label>
                            )}

                        </div>
                    </label>
                    }
                    <button onClick = {() => {
                        if(userName !== ""){
                            setComplete(true);
                            localStorage.setItem("allergens", allergenList.toString())
                        }
                        else{
                            alert("Name field cannot be empty")}
                        }
                    }>Finish</button>
                </div>
            }

        </div>
        </div>
    );
}

export default Login;