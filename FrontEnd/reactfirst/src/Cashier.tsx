import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
        
//URL variable, change depending on local testing or Live push
const BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
//const BackendURL = "http://localhost:3000/";

const navigate = useNavigate();

type Item = {
    name: string;
    group: string;
    cost: number;
    id: number;
};

type orderItem = Item &{
    icePer: number;
    sugarPer: number;
    topping: string;
    totalCost: number;
    itemID: number;

}

const toppingOptions = [
    'None', 'Pearl', 'Red Bean', 'Herb Jelly', 'Aiyu Jelly', 'Lychee Jelly',
    'Mini Pearl', 'Ice Cream Pudding', 'Aloe Vera', 'Crystal Boba'
  ];

function Cashier() {
    const [cart_Items, set_Cart_Items] = useState<orderItem[]>([]);
    const [menu_Items, set_Menu] = useState("");
    const [customize, setCustomize] = useState<Item | null>(null);
    const [icePer, setIcePer] = useState(100);
    const [sugarPer, setSugarPer] = useState(100);
    const [finalTopping, setFinalTopping] = useState<string>("None");

    React.useEffect(()=>{
        fetch(BackendURL + "manager/menu")
            .then((res) => res.json())
            .then((data) => set_Menu(data))
            .catch(e => console.log(e))
    }, []);


    var menu_Data = JSON.parse(JSON.stringify(menu_Items));
    const menu: Item[] = [];
    for(var i in menu_Data){
        menu.push({id: menu_Data[i].id, name: menu_Data[i].item_name, cost: menu_Data[i].base_cost, group: menu_Data[i].item_group});
    }

    const menuCategories: Record<string, Item[]>={};

    menu.forEach(item=>{
        if(menuCategories[item.group]){
            menuCategories[item.group].push(item);
        }
        else {
            menuCategories[item.group] = [];
            menuCategories[item.group].push(item);}
    });

    const genID = ():number=> {
        return Math.floor(9999999 * Math.random());
    }

    const add_Item = function(){

        let toppingCost = 1;
        if(finalTopping==='None'){
            toppingCost = 0;
        }

        const itemAdded: orderItem = {
            icePer: icePer,
            sugarPer: sugarPer,
            topping: finalTopping,
            totalCost: customize !== null ? customize.cost +toppingCost : 0,
            name: customize !== null ? customize.name: '',
            group: customize !== null ? customize.group: '',
            cost: customize !== null ? customize.cost: 0,
            id: customize !== null ? customize.id: 0,
            itemID: genID()
        }

        set_Cart_Items(function(prev) {
                return prev.concat(
                    [itemAdded]
                )
            }
        );

        setIcePer(100);
        setSugarPer(100);
        setFinalTopping('None')
        setCustomize(null);
    };

    const remove_Item=(itemID:number)=>{
        set_Cart_Items(prev_Items=>{
            const add_Item: orderItem[]=[];
            prev_Items.forEach(item=>{
                if (!(itemID === item.itemID))
                    add_Item.push(item);
            });
            return add_Item;
        });
    };

    let total_Cost = 0;
    cart_Items.forEach(item=>{
        total_Cost += item.totalCost;
    });

    const [checkoutPopup, setCheckoutPopup] = useState(false);

    const [thankYou, showThankyou] = useState(false);

    const submitOrder = async (tip: number) => {
        try {
            const order = {
                items: cart_Items,
                totalCost: total_Cost,
                tipPercentage: tip,
                tipTotal: total_Cost * (tip/ 100),
                orderTotal: total_Cost * (1 + tip/100),
                timestamp: new Date().toLocaleString()
            };

            const response = await fetch(`${BackendURL}submitOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
            if(!response.ok){
                const serverMessage = await response.text();
                console.error('Server returned error:', serverMessage);
                throw new Error(serverMessage);
            }

            console.log('Order successfully submitted');

            set_Cart_Items([]);
            setCheckoutPopup(false);
            showThankyou(true);
        }
        catch(error: any){
            console.error('Error submitting order:', error.message || error);
            alert(`Error Submitting Order: ${error.message || error}`);
        }
    };




    return(
        <div style = {{
            height: '100vh',
            width: '100vw',
            display: 'flex',
        }}>{/* left 80*/}
            <div style = {{
                width: '80%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}> {/* menu items*/}
                <div style = {{
                    height: '40%',
                    padding: '8px',
                    borderRadius: '8px'
                }}>
                    <h2 style = {{
                        textAlign: 'center'
                    }}>
                        Menu
                    </h2>
                    <div style = {{
                        display: 'grid',
                        gap: '10px',
                        gridTemplateColumns: 'repeat(10, 120px)'
                    }}>

                        {Object.entries(menuCategories).map(function([, value_Items]) {
                            return value_Items.map(function(item){
                                    let backgroundColor='black';
                                    if (customize !== null && customize.id === item.id){
                                        backgroundColor='green';
                                    }
                                    return(
                                        <button
                                            key = {item.id}
                                            style = {{
                                                height: '100px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '6px',
                                                fontSize: '10px',
                                                backgroundColor: backgroundColor,
                                                color: 'white'
                                            }}
                                            onClick = {function() {
                                                setCustomize(item);
                                            }}>
                                            <span>{item.name}</span>
                                            <span>${item.cost.toFixed(2)}</span>
                                        </button>
                                    );
                                }
                            );
                        })}
                    </div>
                </div>

                {/* Customization Section*/}
                <div style = {{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    padding: '10px'
                }}>
                    <h2 style = {{
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>Customization
                    </h2>

                    <div style = {{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                    }}>{/* Ice*/}
                        <div>
                            <h3 style = {{
                                textAlign: 'center',
                                fontSize: '12px'
                            }}>Ice Percentage</h3>
                            <div style = {{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px'
                            }}>
                                {[100, 50, 25, 0].map(function(per){
                                        let backgroundColor='grey';
                                        let color='white';
                                        let opacity=1;
                                        if(icePer===per){
                                            backgroundColor='green';
                                        }
                                        return(
                                            <button
                                                key = {per}
                                                onClick = {function() {
                                                    setIcePer(per);
                                                }}
                                                style = {{
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    backgroundColor: backgroundColor,
                                                    color: color,
                                                    fontSize: '12px',
                                                    opacity: opacity
                                                }}
                                            >{per}%
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>{/* Sugar*/}
                        <div>
                            <h3 style = {{
                                textAlign: 'center',
                                fontSize: '12px'
                            }}>Sugar Percentage</h3>
                            <div style = {{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px'
                            }}>
                                {[100, 50, 25, 0].map(function(per){
                                        let backgroundColor='grey';
                                        let color='white';
                                        let opacity=1;
                                        if(sugarPer===per){
                                            backgroundColor='green';
                                        }
                                        return(
                                            <button
                                                key = {per}
                                                onClick = {function() {
                                                    setSugarPer(per);
                                                }}
                                                style = {{
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    backgroundColor: backgroundColor,
                                                    color: color,
                                                    fontSize: '12px',
                                                    opacity: opacity
                                                }}
                                            >{per}%
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>

                    <div style = {{

                    }}>
                        <h3 style = {{
                            textAlign: 'center',
                            fontSize: '12px'
                        }}>(+$1) Toppings</h3>
                        <div style = {{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(10, 120px)',
                            gap: '8px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            {toppingOptions.map(function(top){
                                let backgroundColor='grey';
                                let color='white';
                                let opacity=1;
                                if(finalTopping===top){
                                    backgroundColor='green';
                                }
                                return(
                                    <button
                                        key = {top}
                                        onClick = {function() {
                                            setFinalTopping(top);
                                        }}
                                        style = {{
                                            height: '120px',
                                            width: '120px',
                                            borderRadius: '8px',
                                            backgroundColor: backgroundColor,
                                            color: color,
                                            fontSize: '12px',
                                            opacity: opacity
                                        }}
                                    >{top}
                                    </button>
                                );
                            })}
                        </div>
                    </div>{/* Add and Cancel Buttons*/}

                    <div style = {{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginTop: '14px'
                    }}>
                        <button
                            onClick = {
                                add_Item
                            }
                            style = {{
                                backgroundColor: 'green',
                                color: 'white',
                                borderRadius: '5px',
                                fontSize: '12px',
                                opacity: 1
                            }}>Add
                        </button>
                        <button
                            onClick = {() => {
                                setIcePer(100);
                                setSugarPer(100);
                                setFinalTopping('None');
                                setCustomize(null);
                            }
                            }
                            style = {{
                                backgroundColor: 'red',
                                color: 'white',
                                borderRadius: '5px',
                                fontSize: '12px',
                                opacity: 1
                            }}>Cancel
                        </button>
                    </div>
                </div>
            </div>

            <div style = {{
                width: '20%',
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center',
                gap: '20px'
            }}>

                <h2 style = {{textAlign: 'center'}}> Order </h2>

                <div style = {{
                    overflowY:  'auto',
                    gap: '50px'
                }}>

                    {cart_Items.map(item=>(
                        <div key = {item.id}
                             style = {{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 width: '185px',
                                 height: '50px',
                                 backgroundColor: '#D3D3D3',
                                 borderRadius: '10px',
                                 fontSize: '12px',

                             }}>
                            <div style = {{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '80%',

                            }}>
                                <div style = {{
                                    textAlign: 'center',
                                }}>
                                    {item.name}
                                </div>
                                <div style = {{
                                    textAlign: 'center'
                                }}>
                                    ${item.totalCost.toFixed(2)}
                                </div>
                            </div>
                            <button onClick={()=> remove_Item(item.itemID)}
                                    style = {{
                                        justifyContent: 'right',
                                        textAlign: 'right'
                                    }}>
                                x
                            </button>
                        </div>
                    ))
                    }
                </div>

                <div style = {{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style = {{
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>
                        <span> Total:  </span>
                        <span> ${total_Cost.toFixed(2)} </span>
                    </div>
                    <button
                    onClick={() => setCheckoutPopup(true)}
                    style = {{
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        Checkout
                    </button>
                    <button onClick={() => navigate('/')}>Back to Login</button>
                </div>
            </div>

    )
    {checkoutPopup && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                backgroundColor: 'black',
                borderColor: 'white',
                padding: '1000px',
                borderRadius: '40px',
                textAlign: 'center'
            }}>
                <h2>Order Confirmed!</h2>
                <p>Tip:</p>
                <button
                    onClick={() => {
                        setCheckoutPopup(false);
                    }}>Back to Menu</button>
                <button onClick={() => submitOrder(15)}>15%</button>
                <button onClick={() => submitOrder(20)}>20%</button>
                <button onClick={() => submitOrder(25)}>25%</button>
                <button onClick={() => submitOrder(0)}>No Tip</button>
            </div>
    </div>
)}
{thankYou && (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <div style={{
            backgroundColor: 'darkslategrey',
            borderColor: 'white',
            padding: '1000px',
            borderRadius: '40px',
            textAlign: 'center'
        }}>
            <h2>Thank you for shopping with us!</h2>
            <button
            onClick={() => {
                setCheckoutPopup(false);
                showThankyou(false);
            }}>Back to Menu</button>
        </div>
    </div>
)}
    </div>
    );

}


export default Cashier;

