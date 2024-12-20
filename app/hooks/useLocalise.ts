import { useState, useEffect } from 'react';


const useLocalise = (prop:'country'|'timezone' = 'country'): [any,boolean,any] => {
    const [timezones, setTimezones] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {   
        const fetchTimezones = async () => {
            try {
                const url = prop === 'country' ?
                'https://api.first.org/data/v1/countries':
                'https://timeapi.io/api/timezone/availabletimezones'

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: string[] = await response.json(); 
                setTimezones(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTimezones();
    }, []);

    return [timezones, loading, error];
};

export default useLocalise;
