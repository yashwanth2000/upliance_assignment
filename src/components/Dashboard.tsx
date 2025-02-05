// src/components/Dashboard.tsx
import { useEffect, useState, useCallback } from 'react';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSpring, animated } from '@react-spring/web';

interface CounterHistory {
	timestamp: string;
	value: number;
}

interface UserActivity {
	date: string;
	updates: number;
}

const Dashboard = () => {
	const [counterHistory, setCounterHistory] = useState<CounterHistory[]>([]);
	const [userActivity, setUserActivity] = useState<UserActivity[]>([]);

	const fadeIn = useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: { duration: 1000 }
	});

	const generateDummyData = useCallback(() => {
		// Generate realistic counter history
		const currentCount = parseInt(localStorage.getItem('count') || '10');
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return {
				timestamp: date.toLocaleDateString(),
				value: Math.max(5, currentCount + Math.floor(Math.random() * 15))
			};
		}).reverse();
		setCounterHistory(last7Days);

		// Generate realistic user activity
		const activityData = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return {
				date: date.toLocaleDateString(),
				updates: 1 + Math.floor(Math.random() * 4)
			};
		}).reverse();
		setUserActivity(activityData);
	}, []);

	useEffect(() => {
		generateDummyData();
		const interval = setInterval(generateDummyData, 9000);
		return () => clearInterval(interval);
	}, [generateDummyData]);

	return (
		<animated.div style={fadeIn}>
			<Box p={[2, 4, 6]}>
				<Text fontSize={['xl', '2xl']} fontWeight="bold" mb={[4, 6]}>
					Dashboard Analytics
				</Text>

				<Grid
					templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
					gap={[4, 6]}
				>
					<GridItem w="100%">
						<Box
							p={[2, 4]}
							borderRadius="lg"
							boxShadow="sm"
							bg="white"
							height={['300px', '400px']}
						>
							<Text fontSize={['md', 'lg']} mb={4}>Counter History</Text>
							<ResponsiveContainer width="100%" height="85%">
								<LineChart data={counterHistory}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="timestamp"
										tick={{ fontSize: 12 }}
										angle={-45}
										textAnchor="end"
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="value"
										stroke="#8884d8"
										name="Counter Value"
										strokeWidth={2}
									/>
								</LineChart>
							</ResponsiveContainer>
						</Box>
					</GridItem>

					<GridItem w="100%">
						<Box
							p={[2, 4]}
							borderRadius="lg"
							boxShadow="sm"
							bg="white"
							height={['300px', '400px']}
						>
							<Text fontSize={['md', 'lg']} mb={4}>User Profile Updates</Text>
							<ResponsiveContainer width="100%" height="85%">
								<BarChart data={userActivity}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										tick={{ fontSize: 12 }}
										angle={-45}
										textAnchor="end"
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="updates"
										fill="#82ca9d"
										name="Profile Updates"
									/>
								</BarChart>
							</ResponsiveContainer>
						</Box>
					</GridItem>
				</Grid>
			</Box>
		</animated.div>
	);
};

export default Dashboard;