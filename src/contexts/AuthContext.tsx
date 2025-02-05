import { createContext, useContext, useState, useEffect } from 'react';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase';

interface MockUser {
	id: string;
	email: string;
	name: string;
	authType: 'mock';
}

interface GoogleUser extends FirebaseUser {
	authType: 'google';
}

type User = MockUser | GoogleUser;

interface AuthContextType {
	user: User | null;
	loginWithGoogle: () => Promise<void>;
	loginWithMock: (email: string, password: string) => Promise<void>;
	signupWithMock: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
}

// Mock users database
const mockUsers = [
	{ id: '1', email: 'test@test.com', password: 'password123', name: 'Test User' },
	{ id: '2', email: 'test2@test.com', password: 'password123', name: 'Test User 2' }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				setUser({ ...firebaseUser, authType: 'google' });
			} else {
				const mockUser = localStorage.getItem('mockUser');
				if (mockUser) {
					setUser({ ...JSON.parse(mockUser), authType: 'mock' });
				} else {
					setUser(null);
				}
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			setUser({ ...result.user, authType: 'google' });
		} catch (error) {
			console.error('Error signing in with Google:', error);
			throw error;
		}
	};

	const loginWithMock = async (email: string, password: string) => {
		const user = mockUsers.find(u => u.email === email && u.password === password);
		if (!user) {
			throw new Error('Invalid credentials');
		}
		const { password: _, ...mockUser } = user;
		const userWithType = { ...mockUser, authType: 'mock' as const };
		localStorage.setItem('mockUser', JSON.stringify(userWithType));
		setUser(userWithType);
	};

	const signupWithMock = async (email: string, password: string, name: string) => {
		if (mockUsers.some(u => u.email === email)) {
			throw new Error('User already exists');
		}
		const newUser = {
			id: String(mockUsers.length + 1),
			email,
			password,
			name
		};
		mockUsers.push(newUser);
		const { password: _, ...mockUser } = newUser;
		const userWithType = { ...mockUser, authType: 'mock' as const };
		localStorage.setItem('mockUser', JSON.stringify(userWithType));
		setUser(userWithType);
	};

	const logout = async () => {
		if (user?.authType === 'google') {
			await signOut(auth);
		}
		localStorage.removeItem('mockUser');
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loginWithGoogle,
				loginWithMock,
				signupWithMock,
				logout,
				loading
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};