import { Spinner } from "./spinner";

export function Loader() {
	return (
		<div className="flex h-full items-center justify-center pt-8">
			<Spinner className="size-6" />
		</div>
	);
}
