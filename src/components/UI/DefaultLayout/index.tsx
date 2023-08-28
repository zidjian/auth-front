import { Link } from "react-router-dom";

interface DefaultLayoutProps {
	children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/sign-up">Sign Up</Link>
						</li>
					</ul>
				</nav>
			</header>
			<main>{children}</main>
		</>
	);
}
