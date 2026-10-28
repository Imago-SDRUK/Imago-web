import type { AppContext } from '$lib/server/application/context'
import type { IAnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'

export const answersGetInsightsUseCase = async ({
    answers_repository,
    authorisation_module,
    session,
    configuration
}: {
    answers_repository: IAnswersRepository
} & AppContext) => {
    const [permission_errors, permission] =
        await authorisation_module.authorise({
            namespace: 'Application',
            object: 'dashboard',
            permits: 'read',
            actor: session.identity.id,
            configuration
        })

    if (permission_errors) {
        return err(permission_errors)
    }

    if (!permission.allowed) {
        return err({ reason: 'Unauthorised' })
    }

    const [total_errors, totalSignUps] =
        await answers_repository.getTotalNewsletterSignUps()

    if (total_errors !== null) {
        return err(total_errors)
    }

    const [country_errors, signUpsByCountry] =
        await answers_repository.getNewsletterSignUpsByCountry()

    if (country_errors !== null) {
        return err(country_errors)
    }

    const [category_errors, signUpsByCategory] =
        await answers_repository.getNewsletterSignUpsByCategory()

    if (category_errors !== null) {
        return err(category_errors)
    }

    const [download_errors, signUpsWithDownloads] =
        await answers_repository.getNewsletterSignUpsWithDownloads()

    if (download_errors !== null) {
        return err(download_errors)
    }

    const [top_errors, topDownloadedResourcesByCategory] =
        await answers_repository.getTopDownloadedResourcesByCategory()

    if (top_errors !== null) {
        return err(top_errors)
    }

    return ok({
        totalSignUps,
        signUpsByCountry,
        signUpsByCategory,
        signUpsWithDownloads,
        topDownloadedResourcesByCategory
    })
}