import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"

export const Signup = () => {
    return <div className="bg-[rgba(248,233,226,0.44)]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="Sign up" />
            </div>
            <div className="hidden lg:block">
                <Quote/>
            </div>
        </div>
    </div>
}




