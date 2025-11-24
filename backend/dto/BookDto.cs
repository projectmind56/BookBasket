public class BookUploadDto
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string ISBN { get; set; }
    public string Publisher { get; set; }
    public string Category { get; set; }
    public int Quantity { get; set; } = 1;
    public string Description { get; set; }
    public IFormFile Cover { get; set; }  // file input
    public int DonorId { get; set; }
}

public class EBookUploadDto
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string ISBN { get; set; }
    public string Publisher { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public IFormFile EBookFile { get; set; }  // file input
    public int DonorId { get; set; }
}
