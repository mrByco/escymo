namespace shared.models;

public enum EMinecraftServerStatus
{
    STARTING,
    RUNNING,
    STOPPING,
    SAVING,
}

[Serializable]
public class MinecraftServerStatus
{
    public String Id { get; set; }
    public String? NodeId { get; set; }
    public EMinecraftServerStatus Status
    {
        get;
        set;
    }
}