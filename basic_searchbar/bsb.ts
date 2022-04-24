interface SearchBarProps {
    strings: Array<string>;
}
function SearchBar({ strings }: SearchBarProps): JSX.Element {
    const [searchText, setSearchText] = useState<string>("");
    const [visibleWords, setVisibleWords] = useState<Array<string>>([]);

    useEffect(() => {
        setVisibleWords(
            strings.filter((string: string) => string.includes(searchText))
        );
    }, [searchText]);

    return (
        <div>
            <input
                type="text"
                placeholder="search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            {visibleWords.map((string: string) => (
                <div key={string}>{string}</div>
            ))}
        </div>
    );
}
