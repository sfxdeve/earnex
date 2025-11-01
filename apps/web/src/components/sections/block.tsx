"use client";
import React, { useEffect, useState } from "react";

const Block = () => {
	const [data, setData] = useState([{ Action: "", Message: "" }]);
	useEffect(() => {
		fetch("https://sheetdb.io/api/v1/l8z4z8nvnbgpj")
			.then((response) => response.json())
			.then((data) => setData(data));
	}, []);

	console.log(data);

	return (
		<div>
			{data[0].Action == "Blocked" && (
				<div className="fixed top-0 right-0 bottom-0 left-0 z-[1000] flex w-full items-center justify-center bg-[#f14f44] px-3 py-2 text-center text-white">
					<p className="font-medium text-[22px] sm:text-4xl">
						{data[0].Message}
					</p>
				</div>
			)}
		</div>
	);
};

export default Block;
