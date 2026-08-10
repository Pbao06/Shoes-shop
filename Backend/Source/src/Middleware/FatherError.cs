namespace src.Middleware;

public class FatherError : Exception
{
    public int StatusCode { get; }

    public FatherError(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }
}

public class NotFoundError : FatherError
{
    public NotFoundError(string message) : base(message, 404)
    {
    }
}

public class ValidationError : FatherError
{
    public ValidationError(string message) : base(message, 400)
    {
    }
}

public class UnauthorizedError : FatherError
{
    public UnauthorizedError(string message) : base(message, 401)
    {
    }
}

public class ForbiddenError : FatherError
{
    public ForbiddenError(string message) : base(message, 403)
    {
    }
}

public class ConflictError : FatherError
{
    public ConflictError(string message) : base(message, 409)
    {
    }
}
