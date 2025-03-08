import { Link } from "react-router-dom";

const NotFound = () => {
    return (
		<div className="h-[50vh] grid place-content-center gap-8">
			<div className="text-center  text-2xl ">Page not found</div>
			<button className="text-center btn-primary">
				<Link to="/">Return to Home</Link>
			</button>
		</div>
	);
}

export default NotFound