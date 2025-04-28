import { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import React from 'react';
import { useNavigate } from 'react-router-dom';

//URL variable, change depending on local testing or Live push
const BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
//const BackendURL = "http://localhost:3000/";

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

const CustomItemWindow = ({item, save, cancel}:
                          {
                              item: Item;
                              save: (
                                  customize: {
                                      icePer: number;
                                      sugarPer: number;
                                      totalCost: number;
                                      topping: string;
                                      itemID: number;

                                  }
                              ) => void;
                              cancel: (

                              ) => void;
                          }
) =>{
    const [icePer, setIcePer] = useState(100);
    const [sugarPer, setSugarPer] = useState(100);
    const [finalTopping, setFinalTopping] = useState<string>("None");


    const genID = ():number=> {
        return Math.floor(9999999 * Math.random());
    }

    const saveSetter =()=> {
        let toppingCost = 0;
        if (!(finalTopping === 'None')) {toppingCost = 1;}
        save (
            {
                icePer,
                sugarPer,
                totalCost: item.cost + toppingCost,
                topping: finalTopping,
                itemID: genID()
            }
        )
    };

    //allergen alert logic
    const [isAllergic, setIsAllergic] = useState(false);
    const [ingredients, setIngredients] = useState(new Array<string>());
    const allergens = localStorage.getItem("allergens");
    const [allergicIngredients, setAllergicIngredients] = useState(new Array<string>());

    //get menu item ingredients
    useEffect(() =>{
        fetch(BackendURL + "ingredients?" + "id=" + item.id.toString())
            .then((res) => res.json())
            .then((data) =>{


                for(let i = 0; i < data.length; ++i) {
                    if(data[i] !== "Cups" && data[i] !== "Lid" && data[i] != "Straws") {
                        setIngredients((ingredients) => [...ingredients, data[i]])
                    }

                    if (allergens !== null && allergens.includes(data[i])) {
                        setAllergicIngredients((allergicIngredients) => [...allergicIngredients, data[i]]);
                        setIsAllergic(true);

                    }
                }
            });




    }, [item]);

    return (
        <div style = {{display: 'flex', position: 'absolute', alignItems: 'center', justifyContent: 'center', top: '0%'}}>
            <div style = {{ backgroundColor: 'darkslategray', borderRadius: '15px', width: '100vw', height: '4000px', maxWidth: '100%', maxHeight: '100%'}}>
                <h1 style = {{textAlign: 'center'}}>Customize: {item.name}</h1>
                {isAllergic && <h1 style = {{color: 'red', fontSize: '20pt', textAlign: 'center'}}>WARNING: THIS ITEM CONTAINS INGREDIENT(S) YOU HAVE MARKED AS ALLERGEN(S): {allergicIngredients.map((ingredient:string) => <li>{ingredient}</li>)}</h1>}
                <p style={ {textAlign: 'center'}}><label>Ingredients:</label>{ingredients.map((ingredient) => <li>{ingredient}</li>)}</p>
                <h2 style = {{textAlign: 'center'}}>Ice</h2>
                <div style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px'}}>
                    {
                        [100,50,25,0].map(percentage=>{
                            const perChosen = icePer === percentage;
                            return (
                                <button
                                    key = {percentage}
                                    onClick={()=>setIcePer(percentage)}
                                    style={{
                                        backgroundColor: (()=>{
                                            if(!(perChosen)) {return 'grey';}
                                            else {return 'green';}
                                        })(),
                                        color: 'white',
                                        width: '100px',
                                        height: '100px'
                                    }}
                                >{percentage}%</button>
                            )
                        })
                    }
                </div>
                <h3 style = {{textAlign: 'center'}}>Sugar</h3>
                <div style = {{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    {
                        [100,50,25,0].map(percentage=>{
                            const perChosen = sugarPer === percentage;
                            return (
                                <button
                                    key = {percentage}
                                    onClick={()=>setSugarPer(percentage)}
                                    style={{
                                        backgroundColor: (()=>{
                                            if(!(perChosen)) {return 'grey';}
                                            else {return 'green';}
                                        })(),
                                        color: 'white',
                                        width: '100px',
                                        height: '100px'
                                    }}
                                >{percentage}%</button>
                            )
                        })
                    }
                </div>
                <h4 style = {{textAlign: 'center'}}>Topping +$1</h4>
                <div style = {{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    {
                        toppingOptions.map(top=>{
                            const topChosen = finalTopping === top;
                            return (
                                <button
                                    key = {top}
                                    onClick={()=>setFinalTopping(top)}
                                    style={{
                                        backgroundColor: (()=>{
                                            if(!(topChosen)) {return 'grey';}
                                            else {return 'green';}
                                        })(),
                                        color: 'white',
                                        width: '100px',
                                        height: '100px'
                                    }}
                                >{top}</button>
                            )
                        })
                    }
                </div>
                <div style = {{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '40px',
                    gap: '100px'
                }}>
                    <button
                        onClick = {saveSetter}
                        style = {{
                            backgroundColor: 'green',
                            color: 'white',
                            borderRadius: '10px',
                            width: '100px',
                            height: '100px'
                        }}
                    >
                        Add To Order
                    </button>
                    <button
                        onClick = {cancel}
                        style = {{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '10px',
                            width: '100px',
                            height: '100px'
                        }}
                    >
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    )
}

function Customer() {
    const [cart_Items, set_Cart_Items] = useState<orderItem[]>([]);
    const [menu_Items, set_Menu] = useState("");
    const [customize, setCustomize] = useState<Item | null>(null);

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

    const [weatherData, setWeatherData] = useState<any>(null);

    const genID = ():number=> {
        return Math.floor(9999999 * Math.random());
    }

    const getWeatherIcon = (code: number): string => {
        if ([0].includes(code)) return "☀️";             // Clear
        if ([1, 2].includes(code)) return "🌤️";          // Mostly clear, partly cloudy
        if ([3].includes(code)) return "☁️";             // Overcast
        if ([45, 48].includes(code)) return "🌫️";        // Fog
        if ([51, 53, 55].includes(code)) return "🌦️";    // Drizzle
        if ([61, 63, 65].includes(code)) return "🌧️";    // Rain
        if ([66, 67].includes(code)) return "🌧️❄️";      // Freezing rain
        if ([71, 73, 75, 77].includes(code)) return "❄️"; // Snow
        if ([80, 81, 82].includes(code)) return "🌦️";    // Showers
        if ([85, 86].includes(code)) return "🌨️";        // Snow showers
        if ([95].includes(code)) return "⛈️";             // Thunderstorm
        if ([96, 99].includes(code)) return "⛈️⚡";        // Thunderstorm with hail
        return "❓";                                       // Unknown
    };


    useEffect(() => {
        const fetchWeather = async () => {
            try {
                console.log("Fetching weather data...");
                const params = {
                    latitude: 30.628,
                    longitude: -96.3344,
                    current: ["temperature_2m", "weather_code", "precipitation"],
                    timezone: "Europe/Moscow",
                    temperature_unit: "fahrenheit"
                };
                const url = "https://api.open-meteo.com/v1/forecast";
                const responses = await fetchWeatherApi(url, params);

                if (!responses || responses.length === 0) {
                    throw new Error("Invalid response from weather API");
                }

                const response = responses[0];
                const current = response.current()!;

                const currentWeatherTime = new Date(Number(current.time()) * 1000);
                const temperature = Number(current.variables(0)!.value()).toFixed(1);
                const weatherCode = Number(current.variables(1)!.value());
                const precipitation = Number(current.variables(2)!.value()).toFixed(2);

                const weatherIcon = getWeatherIcon(weatherCode);

                const weatherData = {
                    current: {
                        time: currentWeatherTime,
                        temperature2m: temperature,
                        weatherCode,
                        precipitation,
                        icon: weatherIcon
                    }
                };

                setWeatherData(weatherData);
                console.log("Weather data received:", weatherData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeather();
    }, []);

    const menuCategories: Record<string, Item[]>={};

    menu.forEach(item=>{
        if(menuCategories[item.group]){
            menuCategories[item.group].push(item);
        }
        else {
            menuCategories[item.group] = [];
            menuCategories[item.group].push(item);}
    });

    const add_Item = (customizedItem: {
        icePer: number;
        sugarPer: number;
        topping: string;
        totalCost: number;
        name: string;
        group: string;
        cost: number;
        id: number;
        itemID: number;
    }) => {
        set_Cart_Items(prev_Items=>
            prev_Items.concat(
                {
                    icePer: customizedItem.icePer,
                    sugarPer: customizedItem.sugarPer,
                    topping:customizedItem.topping,
                    totalCost: customizedItem.totalCost,
                    name: customizedItem.name,
                    group: customizedItem.group,
                    cost: customizedItem.totalCost,
                    id: customizedItem.id,
                    itemID: genID()
                }
            )
        );
    };

    const remove_Item=(itemID:number)=>{
        set_Cart_Items(prev_Items=>{
            const new_Item: orderItem[]=[];
            prev_Items.forEach(item=>{
                if (!(itemID === item.itemID))
                    new_Item.push(item);
            });
            return new_Item;
        });
    };


    let total_Cost = 0;
    cart_Items.forEach(item=>{
        total_Cost += item.cost;
    });

    const [fontSize, setFontSize] = useState(16);

    const changeFontSize = (action: 'Increase' | 'Decrease' | 'Default')=>{
        setFontSize((prev) => {
            if(action == 'Increase') return Math.min(60, prev + 2);
            if(action == 'Decrease') return Math.max(16, prev - 2);
            return 16;
        });
    };

    useEffect(()=> {document.documentElement.style.fontSize=`${fontSize}px`});

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


    const navigate = useNavigate();

    return (
        <div>
            <div style = {{
                height: '5%',
                alignContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <div style={{ padding: '1rem'}}>
                    <div style={{ marginBottom: '1rem'}}>
                        <p><u>Change Language and Font Size</u></p>
                        <div id = "GoogleTranslate"></div>
                        <button onClick={() => changeFontSize('Increase')}>Increase</button>
                        <button onClick={() => changeFontSize('Decrease')}>Decrease</button>
                        <button onClick={() => changeFontSize('Default')}>Default</button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', height: '95%' }}>
                {/* Weather Display - Top Right */}
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(29, 13, 13, 0.87)',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3>Weather</h3>
                    {weatherData ? (
                        <div>
                            <p>{weatherData.current.icon} {weatherData.current.temperature2m}°F</p>
                            {(weatherData.current.weatherCode >= 51 && weatherData.current.weatherCode <= 67) || // Drizzle & Freezing Rain
                            (weatherData.current.weatherCode >= 61 && weatherData.current.weatherCode <= 65) || // Rain
                            (weatherData.current.weatherCode >= 80 && weatherData.current.weatherCode <= 82) || // Showers
                            (weatherData.current.weatherCode === 95 || weatherData.current.weatherCode === 96 || weatherData.current.weatherCode === 99) // Thunderstorms
                                ? (
                                    <p>🌧️ Precipitation: {weatherData.current.precipitation} mm</p>
                                ) : null}
                            <p>Last Updated: {weatherData.current.time.toLocaleString(undefined, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>

                        </div>
                    ) : (
                        <p>Loading Weather...</p>
                    )}

                </div>

                {/*Left (80%) side of the page, menu item buttons*/}
                <div style= {{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h1 style = {{textAlign: 'center'}}> Menu </h1>

                    {
                        Object.entries(menuCategories).map(([key_Cat, value_Items])=>(
                            <div key={key_Cat}
                                 style = {{
                                     textAlign: 'center'
                                 }}
                            >
                                <h2> {key_Cat} </h2>
                                <div style = {{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    gap: '20px',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap'
                                }}>
                                    {
                                        value_Items.map((item)=>(
                                            <button key={item.id}
                                                    onClick={()=> setCustomize(item)}
                                                    style = {{
                                                        height: '150px',
                                                        width: '150px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        backgroundColor: 'black',
                                                    }}

                                            >

                                        <span style = {{
                                            justifyContent: 'center'
                                        }}>
                                            {item.name}
                                        </span>

                                                <span style = {{
                                                    justifyContent: 'center'
                                                }}>
                                            ${item.cost.toFixed(2)}
                                        </span>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                {/*Right (20%) side of the page, current order*/}
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
                                        ${item.cost.toFixed(2)}
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
                    </div>
                </div>



                {/*Modify Item Popup*/}
                {customize && (
                    <CustomItemWindow
                        item={customize}
                        save={(customizedOptions) =>
                        {
                            add_Item(
                                {
                                    icePer: customizedOptions.icePer,
                                    sugarPer: customizedOptions.sugarPer,
                                    totalCost: customizedOptions.totalCost,
                                    topping:customizedOptions.topping,
                                    id: customize.id,
                                    name: customize.name,
                                    group: customize.group,
                                    cost: customize.cost,
                                    itemID: customizedOptions.itemID
                                }
                            );
                            setCustomize(null);
                        }
                        }
                        cancel={() => setCustomize(null)}
                    />
                )}

                {checkoutPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 100,
                        left: 400,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            backgroundColor: 'black',
                            padding: '60px',
                            borderRadius: '40px',
                            textAlign: 'center'
                        }}>
                            <h2>Order Confirmed</h2>
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
                            padding: '1000px',
                            borderRadius: '40px',
                            textAlign: 'center'
                        }}>
                            <h2>Thank you for shopping with us!</h2>
                            <button
                                onClick={() => {
                                    navigate("/");
                                }}>Back To Login</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}

export default Customer;