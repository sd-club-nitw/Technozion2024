import React from "react";

const SponsorItem = ({ name, src, alt, title, link }) => {
	return (
		<>
			<div
				className="sponsor-card sponsitem"
			>
				<div className="image-container">
					<img src={src} alt={alt} />
				</div>
				<div className="text-container">
					<hr></hr>
					<div className="container-fluid">
						<h4>
							{" "}
							{link ? (
								<a
									class="title-sponsor"
									target="_blank"
									rel="noreferrer"
									href={`${link}`}
								>
									{" "}
									<strong> {name} </strong>{" "}
								</a>
							) : (
								<strong> {name} </strong>
							)}
						</h4>
						<p>
							{" "}
							<strong> {title ? title : ""} </strong>{" "}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default SponsorItem;

