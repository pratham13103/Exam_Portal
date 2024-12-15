import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"

export const Signin = () => {
    return <div className="bg-[rgba(248,233,226,0.44)]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="Sign in" />
            </div>
            <div className="hidden lg:block">
                <Quote/>
            </div>
        </div>
    </div>
}