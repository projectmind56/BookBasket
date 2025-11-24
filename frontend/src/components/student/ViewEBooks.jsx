import React, { useEffect, useState } from "react";

function ViewEBooks() {
    const [ebooks, setEbooks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedEBook, setSelectedEBook] = useState(null);
    const [showPDF, setShowPDF] = useState(false); // PDF preview in modal
    const [downloadingId, setDownloadingId] = useState(null); // Track which eBook is downloading
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const fetchEBooks = async () => {
        try {
            const res = await fetch("http://localhost:5275/api/Student/getAvailableEBooks");
            const data = await res.json();
            setEbooks(data);
            setFiltered(data);
        } catch {
            console.error("Failed to load eBooks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEBooks();
    }, []);

    // Search filter
    useEffect(() => {
        const s = search.toLowerCase();
        setFiltered(
            ebooks.filter((b) =>
                [b.title, b.author, b.publisher, b.category].join(" ").toLowerCase().includes(s)
            )
        );
    }, [search, ebooks]);

    // Download function
    const handleDownload = async (ebook) => {
        try {
            // Fetch PDF as blob
            const response = await fetch(`http://localhost:5275${ebook.filePath}`);
            if (!response.ok) throw new Error("Failed to fetch file");
            const blob = await response.blob();

            // Create object URL and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = ebook.title + ".pdf"; // ensure it downloads
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url); // cleanup

            const token = await localStorage.getItem('token');
            const payloadJwt = await JSON.parse(atob(token.split('.')[1]));
            const userId = await payloadJwt.nameid;

            // Call your API after download
            const payload = {
                user_id: userId,
                donor_id: ebook.donorId,
                book_id: ebook.id,
                category: "E-Book",
                isbn_no: ebook.isbn,
                quantity: 1,
            };

            await fetch("http://localhost:5275/api/Student/downloadEBook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

        } catch (err) {
            console.error(err);
            alert("Download failed!");
        } finally {
            fetchEBooks();
        }
    };


    if (loading) return <h4 className="text-center mt-5">Loading eBooks...</h4>;

    return (
        <div className="container mt-4">

            <style>{`
        .ebook-card { background:#fff; border-radius:8px; overflow:hidden; transition:0.25s; cursor:pointer; }
        .ebook-card:hover { transform:scale(1.03); box-shadow:0 6px 15px rgba(0,0,0,0.2); }
        .ebook-desc { color:#555; font-size:13px; max-height:32px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .btn-group { display:flex; gap:8px; margin-top:5px; }
        .spinner-border { width: 1.2rem; height: 1.2rem; }
        .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(3px); display:flex; justify-content:center; align-items:center; z-index:9999; }
        .modal-box { background:#fff; padding:20px; width:90%; max-width:600px; border-radius:10px; max-height:90vh; overflow-y:auto; animation:fadeIn 0.3s ease; }
        .modal-pdf { width:100%; height:500px; border:1px solid #ccc; margin-top:10px; }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
      `}</style>

            <h2 className="text-primary mb-4">Available E-Books</h2>

            {/* Search */}
            <input
                type="text"
                className="form-control mb-4"
                placeholder="Search Title, Author, Publisher, Category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* E-Books Grid */}
            <div className="row">
                {filtered.map((ebook) => (
                    <div className="col-6 col-md-2 mb-4" key={ebook.id}>
                        <div className="ebook-card shadow-sm p-2">
                            <h6>{ebook.title}</h6>
                            <p>By {ebook.author}</p>
                            <p className="ebook-desc">{ebook.description}</p>

                            <div className="btn-group">
                                <button
                                    className="btn btn-primary btn-sm flex-grow-1"
                                    onClick={() => {
                                        setSelectedEBook(ebook);
                                        setShowPDF(false);
                                    }}
                                >
                                    View Details
                                </button>
                                <button
                                    className="btn btn-success btn-sm flex-grow-1"
                                    onClick={() => handleDownload(ebook)}
                                    disabled={downloadingId === ebook.id}
                                >
                                    {downloadingId === ebook.id ? (
                                        <div className="spinner-border spinner-border-sm text-light"></div>
                                    ) : (
                                        "Download"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* VIEW DETAILS POPUP */}
            {selectedEBook && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 className="text-primary">{selectedEBook.title}</h3>

                        <div className="mt-3">
                            <p><strong>Author:</strong> {selectedEBook.author}</p>
                            <p><strong>Publisher:</strong> {selectedEBook.publisher}</p>
                            <p><strong>Category:</strong> {selectedEBook.category}</p>
                            <p><strong>ISBN:</strong> {selectedEBook.isbn}</p>
                            <p><strong>Download Count:</strong> {selectedEBook.downloadCount}</p>
                            <p><strong>Description:</strong></p>
                            <p>{selectedEBook.description}</p>
                        </div>

                        <button
                            className="btn btn-info w-100 mt-2"
                            onClick={() => setShowPDF(!showPDF)}
                        >
                            {showPDF ? "Hide Overview" : "Overview"}
                        </button>

                        {showPDF && (
                            <iframe
                                src={`http://localhost:5275${selectedEBook.filePath}`}
                                className="modal-pdf"
                                title="E-Book Preview"
                            ></iframe>
                        )}

                        <button
                            className="btn btn-danger w-100 mt-3"
                            onClick={() => setSelectedEBook(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* DOWNLOAD SUCCESS POPUP */}
            {downloadSuccess && (
                <div className="modal-overlay">
                    <div className="modal-box text-center">
                        <h3 className="text-success">Download Successful!</h3>
                        <p>Your download has started.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewEBooks;
