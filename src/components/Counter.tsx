import { useEffect, useState } from "react";
import { Button, Box, VStack, Flex } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";

type BezierFunction = (t: number) => number;
type BezierEasing = (x1: number, y1: number, x2: number, y2: number) => BezierFunction;

// Bezier curve function
const bezierEasing: BezierEasing = (x1, y1, x2, y2) => {
	return t => {
		if (t === 0 || t === 1) return t;

		let start = 0;
		let end = 1;

		for (let i = 0; i < 10; i++) {
			const current = (start + end) / 2;
			const x = calculateBezier(current, x1, x2);

			if (Math.abs(t - x) < 0.001) {
				return calculateBezier(current, y1, y2);
			}

			if (x < t) {
				start = current;
			} else {
				end = current;
			}
		}

		return calculateBezier((start + end) / 2, y1, y2);
	};
};

const calculateBezier = (t: number, p1: number, p2: number) => {
	const mt = 1 - t;
	return 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t;
};

const Counter = () => {
	const [count, setCount] = useState(() => {
		const saved = localStorage.getItem("count");
		return saved ? parseInt(saved) : 0;
	});

	useEffect(() => {
		localStorage.setItem('count', count.toString());
	}, [count]);

	const springProps = useSpring({
		from: { number: count },
		to: { number: count },
		config: { tension: 300, friction: 20 },
	});

	const backgroundAnimation = useSpring({
		backgroundColor: `rgba(66, 153, 225, ${Math.min(count * 0.1, 0.9)})`,
		config: {
			duration: 200,
			easing: t => bezierEasing(0.4, 0, 0.2, 1)(t)
		},
	});

	const increment = () => setCount(prevCount => prevCount + 1);
	const decrement = () => setCount(prevCount => prevCount - 1);
	const reset = () => setCount(0);

	return (
		<animated.div style={{ ...backgroundAnimation, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Box p={8} borderRadius="lg" width="100%">
				<VStack gap="6">
					<animated.div
						style={{
							fontSize: "48px",
							fontWeight: "bold",
						}}
					>
						{springProps.number.to((val) => Math.floor(val))}
					</animated.div>
					<Box>
						<Flex gap="3" width="100%">
							<Button flex="1" bgColor="green" size="lg" onClick={increment}>
								Increment
							</Button>
							<Button flex="1" bgColor="gray" size="lg" onClick={reset}>
								Reset
							</Button>
							<Button flex="1" bgColor="red" size="lg" onClick={decrement}>
								Decrement
							</Button>
						</Flex>

					</Box>
				</VStack>
			</Box>
		</animated.div >
	);
};

export default Counter;