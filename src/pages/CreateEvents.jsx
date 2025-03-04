import category from "../categories.json";

const CreateEvents = () => {

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState("");
	const [image, setImage] = useState(null);
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("");
	const [capacity, setCapacity] = useState("");
	const [organizer, setOrganizer] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("date", date);
		formData.append("image", image);

		const response = await fetch("http://localhost:5000/api/events", {
			method: "POST",
			body: formData,
		});

		const data = await response.json();
		console.log(data);
	};


	return (
		<section className="  flex justify-center  border-t-1 border-gray-200">
			<form className="flex flex-col w-[50%] space-y-5 my-8 p-8 h-fit border-2  rounded-tr-2xl rounded-bl-2xl text-sm font-base text-purple-900">
				{/* Event Name Input Field */}
				<label htmlFor="title" className="inputlabel">
					Event Name
					<input
						type="text"
						placeholder="Event Name"
						name="title"
						className="inputbox "
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>

				{/* Event Description Input Field */}
				<label htmlFor="Description">
					Description
					<textarea
						name="description"
						id=""
						cols="30"
						rows="10"
						placeholder="Event Description"
						className=" inputbox"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					></textarea>
				</label>

				{/* Event Category Input Field */}
				<label htmlFor="category">
					Category
					<select
						name="category"
						id="category"
						className="bg-gray-50 border-2 border-gray-300  text-gray-800 placeholder:text-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					>
						{category.map((category) => (
							<option
								key={category.category}
								value={category.category}
							>
								{category.name}
							</option>
						))}
					</select>
				</label>

				{/* Event Date Input Field */}
				<label htmlFor="date">
					Date
					<input
						type="date"
						placeholder="Event Date"
						className=" inputbox"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
					/>
				</label>

				{/* Event Time Input Field */}
				<label htmlFor="time">
					Time
					<input
						type="time"
						placeholder="Event Time"
						className="bg-gray-50 border border-gray-300  text-gray-800 placeholder:text-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						required
					/>
				</label>
				{/* Event Location Input Field */}
				<label htmlFor="location">
					Location
					<input
						type="text"
						placeholder="Event Location"
						className=" inputbox"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
				</label>
				{/* Ticket Price Input Field */}
				<label htmlFor="Ticket Price">
					Price Per Ticket
					<input
						type="number"
						placeholder="Ticket Price"
						className=" inputbox"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</label>
				{/* Event Capacity Input Field */}
				<label htmlFor="capacity">
					Capacity
					<input
						type="capacity"
						placeholder="Event Capacity"
						className=" inputbox"
						value={capacity}
						onChange={(e) => setCapacity(e.target.value)}
						required
					/>
				</label>
				{/* Image Input Field */}
				<label htmlFor="image">
					Image
					<input type="file" className="inputbox" value={image} />
				</label>
				<button type="submit" className="btn-secondary ">
					Create Event
				</button>
			</form>
		</section>
	);
};

export default CreateEvents;
