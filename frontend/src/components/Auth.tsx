import axios from "axios"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"

export const Auth = ({ type }: { type: "Sign up" | "Sign in" }) => {
    const navigate = useNavigate();
    const [userInputs, setUserInputs] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    })
    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type == 'Sign up' ? "signup" : "signin"}`, userInputs);
            const jwt = response.data.token;
            localStorage.setItem("token", "Bearer " + jwt);
            const userRole = response.data?.role || userInputs.role;

            // console.log(response.data?.role);
            if(userRole === 'Teacher'){
                // console.log("Create Test");
                navigate('/create-test')
            }else{
                navigate('/exam')
            }
        } catch (error) {
            console.log(error);
            alert("Error while signing up" + error)
        }
    }
    return <div className="">
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <div className="w-1/2">
                {type == "Sign up" ? <div className="md:pr-10 md:text-3xl font-bold ">
                    Create an account
                </div> : <div className="md:pr-10 md:text-3xl font-bold ">
                    Login your account
                </div>}
            </div>
            <div className="w-1/2">
                {type == "Sign up" ?
                    <LabelInput label="Name" placeholder="Tejas P" onChange={(e) => {
                        setUserInputs({
                            ...userInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                <LabelInput label="Email" placeholder="tejas@gmail.com" onChange={(e) => {
                    setUserInputs({
                        ...userInputs,
                        email: e.target.value
                    })
                }} />
                {type == "Sign up" ?
                <LabelInput label="Phone" placeholder="1234567890" onChange={(e) => {
                    setUserInputs({
                        ...userInputs,
                        phone: e.target.value
                    })
                }} />: null}
                <LabelInput label="Password" type="password" placeholder="12345" onChange={(e) => {
                    setUserInputs({
                        ...userInputs,
                        password: e.target.value
                    })
                }} />
                {type == "Sign up" ?
                <DropDownRole onChange={(e) => {
                    setUserInputs({
                        ...userInputs,
                        role: e.target.value
                    })
                }}/>: null}
                <div className="py-4 flex justify-center">
                    <button onClick={sendRequest} type="button" className="w-full py-1 text-white bg-black rounded-full px-4 py- 2 font-semi-bold hover:bg-slate-800">
                        {type}
                    </button>
                </div>
            </div>
            <div className="w-1/2">
                {type == "Sign up" ? <div className="md:pr-10 text-slate-400">
                    Already have an account?
                    <Link className="text-blue-400 underline" to={'/signin'}>Login</Link>
                </div> : <div className="md:pr-10 text-center text-slate-400">
                    Create an account?
                    <Link className="text-blue-400 underline" to={'/signup'}> Signup </Link>
                </div>}
            </div>
        </div>
    </div>
}

interface LabelInputType {
    label: string;
    placeholder: string;
    onChange(e: ChangeEvent<HTMLInputElement>): void;
    type?: string;
}

function LabelInput({ label, placeholder, onChange, type }: LabelInputType) {
    return <div>
        <label className="block mb-2 text-sm font-semi-bold text-slate-600">
            {label}
        </label>
        <div className="w-full max-w-sm min-w-[200px]">
            <input onChange={onChange} type={type || "text"} className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow" placeholder={placeholder} />
        </div>
    </div>
}



function DropDownRole({ onChange }: { onChange(e: ChangeEvent<HTMLSelectElement>): void }) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semi-bold text-slate-600">
                Select Role:
            </label>
            <div className="w-full max-w-sm min-w-[200px]">
                <select
                    id="roleDropdown"
                    onChange={onChange}
                    className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                >
                    <option value="" disabled>
                        Choose a role
                    </option>
                    <option value="Roles">Roles</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    {/* <option value="Admin">Admin</option> */}
                </select>
            </div>
        </div>
    );
}
