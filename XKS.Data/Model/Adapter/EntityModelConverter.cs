namespace XKS.Data.Model.Adapter
{
	public interface IEntityModelConverter<TDataModel, TDomainModel>
		where TDataModel : XKS.Data.Model.ModelBase
		where TDomainModel : Domain.Model.Base.ModelBase
	{
		TDataModel fromDomainToData(TDomainModel domainModel);

		TDomainModel fromDataToDomain(TDataModel dataModel);
	}
}